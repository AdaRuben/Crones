const SupportChatService = require('../services/supportChat.service');

const SUPPORT_NAMESPACE = '/support';

function emitSupportError(socket, error) {
  const message = error instanceof Error ? error.message : 'Unknown support chat error';
  socket.emit('support:error', { message });
  console.error('[support] error:', message);
}

/**
 * Инициализация сокетов технической поддержки.
 *
 * @param {import('socket.io').Server} io
 */
function initSupportChat(io) {
  const namespace = io.of(SUPPORT_NAMESPACE);
  const activeRooms = new Map(); // roomId -> Set<socketId>
  const socketState = new Map(); // socketId -> { chatId, userId, role }

  namespace.on('connection', (socket) => {
    console.log('[support] клиент подключен', socket.id);
    socketState.set(socket.id, { chatId: null, userId: null, role: 'guest' });

    socket.on('support:join', async (rawPayload, callback) => {
      try {
        const payload = rawPayload ?? {};
        const { chatId, userId, role, customerId, adminId, limit } = payload;

        const chat = await SupportChatService.findOrCreateChat({
          chatId,
          customerId,
          adminId,
        });

        const roomId = chat.id.toString();
        if (!socket.rooms.has(roomId)) {
          socket.join(roomId);
        }

        const state = socketState.get(socket.id) ?? {
          chatId: null,
          userId: null,
          role: 'guest',
        };
        state.chatId = roomId;
        state.userId = userId ?? null;
        state.role = role ?? 'guest';
        socketState.set(socket.id, state);

        if (!activeRooms.has(roomId)) {
          activeRooms.set(roomId, new Set());
        }
        activeRooms.get(roomId)?.add(socket.id);

        const messages = await SupportChatService.listMessages(
          chat.id,
          Number(limit ?? 200),
        );

        const response = {
          chat: chat.toJSON(),
          chatId: chat.id,
          userId: state.userId,
          role: state.role,
          members: Array.from(activeRooms.get(roomId) ?? []),
          messages: messages.map((msg) => ({
            id: msg.id,
            chatId: msg.chatId,
            body: msg.body,
            attachments: msg.attachments,
            senderId: msg.senderId,
            senderRole: msg.senderRole ?? msg.senderType ?? 'customer',
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
          })),
        };

        if (typeof callback === 'function') {
          callback({ status: 'ok', data: response });
        } else {
          socket.emit('support:joined', response);
        }

        namespace.to(roomId).emit('support:presence', {
          chatId: chat.id,
          type: 'joined',
          userId: state.userId,
          role: state.role,
        });
      } catch (error) {
        emitSupportError(socket, error);
        if (typeof callback === 'function') {
          callback({ status: 'error', message: error.message });
        }
      }
    });

    socket.on('support:leave', (chatId, callback) => {
      const state = socketState.get(socket.id);
      const targetChatId = (chatId ?? state?.chatId)?.toString();
      if (!targetChatId) {
        if (typeof callback === 'function') {
          callback({ status: 'error', message: 'chatId is required to leave room' });
        }
        return;
      }

      socket.leave(targetChatId);
      activeRooms.get(targetChatId)?.delete(socket.id);

      if (state) {
        state.chatId = state.chatId === targetChatId ? null : state.chatId;
        socketState.set(socket.id, state);
      }

      namespace.to(targetChatId).emit('support:presence', {
        chatId: Number(targetChatId),
        type: 'left',
        userId: state?.userId ?? null,
        role: state?.role ?? 'guest',
      });

      if (typeof callback === 'function') {
        callback({ status: 'ok' });
      }
    });

    socket.on('support:message', async (rawPayload, callback) => {
      try {
        const payload = rawPayload ?? {};
        const { chatId, body, attachments, customerId, adminId, senderType } = payload;

        const state = socketState.get(socket.id) ?? {
          chatId: null,
          userId: null,
          role: 'guest',
        };
        const initialChatId = chatId ?? state.chatId;

        if (!initialChatId && !customerId) {
          throw new Error('chatId or customerId is required to send message');
        }
        if (!body && (!Array.isArray(attachments) || attachments.length === 0)) {
          throw new Error('message body or attachments are required');
        }

        const chat = await SupportChatService.findOrCreateChat({
          chatId: initialChatId,
          customerId,
          adminId,
        });

        const roomId = chat.id.toString();
        if (!socket.rooms.has(roomId)) {
          socket.join(roomId);
        }
        state.chatId = roomId;
        socketState.set(socket.id, state);

        const finalSenderType =
          senderType ?? (state.role === 'admin' ? 'admin' : 'customer');

        const messageRecord = await SupportChatService.appendMessage({
          chatId: chat.id,
          senderType: finalSenderType,
          senderId: state.userId ?? null,
          body: body ?? null,
          attachments: attachments ?? null,
        });

        const message = {
          id: messageRecord.id,
          chatId: chat.id,
          body: messageRecord.body,
          attachments: messageRecord.attachments,
          senderId: messageRecord.senderId,
          senderRole: messageRecord.senderType,
          createdAt: messageRecord.createdAt,
          updatedAt: messageRecord.updatedAt,
        };

        namespace.to(roomId).emit('support:message', message);

        if (typeof callback === 'function') {
          callback({ status: 'ok', data: message });
        }
      } catch (error) {
        emitSupportError(socket, error);
        if (typeof callback === 'function') {
          callback({ status: 'error', message: error.message });
        }
      }
    });

    socket.on('disconnect', () => {
      const state = socketState.get(socket.id);
      const normalizedChatId = state?.chatId?.toString();
      if (normalizedChatId && activeRooms.has(normalizedChatId)) {
        activeRooms.get(normalizedChatId)?.delete(socket.id);
        namespace.to(normalizedChatId).emit('support:presence', {
          chatId: Number(normalizedChatId),
          type: 'left',
          userId: state?.userId ?? null,
          role: state?.role ?? 'guest',
        });
      }
      socketState.delete(socket.id);
      console.log('[support] клиент отключен', socket.id);
    });
  });
}

module.exports = {
  initSupportChat,
  SUPPORT_NAMESPACE,
};
