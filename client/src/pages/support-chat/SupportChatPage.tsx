import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { Input, Button, Typography, Spin, Alert } from 'antd';
import supportChatService from '@/entities/support-chat/api/supportChatService';
import type {
  SupportChat,
  SupportMessage,
} from '@/entities/support-chat/types/types';
import {
  supportJoinResponseSchema,
  supportMessageSchema,
} from '@/entities/support-chat/types/schema';
import { useAppSelector } from '@/shared/api/hooks';
import './SupportChatPage.css';

const SOCKET_NAMESPACE = '/support';

const sortMessages = (messages: SupportMessage[]): SupportMessage[] =>
  [...messages].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

const mergeMessageLists = (
  current: SupportMessage[],
  incoming: SupportMessage[],
): SupportMessage[] => {
  if (incoming.length === 0) return current;
  const map = new Map<number, SupportMessage>();
  current.forEach((msg) => {
    map.set(msg.id, msg);
  });
  incoming.forEach((msg) => {
    map.set(msg.id, msg);
  });
  return sortMessages(Array.from(map.values()));
};

export default function SupportChatPage(): React.JSX.Element {
  const user = useAppSelector((state) => state.auth.user);
  const [chat, setChat] = useState<SupportChat | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const joinedChatIdRef = useRef<number | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(
    () => Boolean(user && messageText.trim().length > 0 && !isSending),
    [isSending, messageText, user],
  );

  const appendMessage = useCallback((incoming: SupportMessage) => {
    setMessages((prev) => {
      if (prev.some((msg) => msg.id === incoming.id)) {
        return prev;
      }
      return sortMessages([...prev, incoming]);
    });
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_NAMESPACE, {
      path: '/socket.io',
      autoConnect: false,
      withCredentials: true,
    });
    socketRef.current = socket;

    const onMessage = (incoming: unknown) => {
      try {
        const parsed = supportMessageSchema.parse(incoming);
        appendMessage(parsed);
      } catch (parseError) {
        console.error('[support] failed to parse incoming message', parseError);
      }
    };

    const onError = (payload: unknown) => {
      if (
        payload &&
        typeof payload === 'object' &&
        'message' in payload &&
        typeof payload.message === 'string'
      ) {
        setError(payload.message);
      } else {
        setError('Произошла ошибка в чате поддержки');
      }
    };

    socket.on('support:message', onMessage);
    socket.on('support:error', onError);

    return () => {
      socket.off('support:message', onMessage);
      socket.off('support:error', onError);
      socket.disconnect();
      socketRef.current = null;
      joinedChatIdRef.current = null;
    };
  }, [appendMessage]);

  useEffect(() => {
    if (!user) return;

    let isActual = true;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const existingChat = await supportChatService.getCustomerChat(user.id);
        if (!isActual) return;

        setChat(existingChat);

        if (existingChat) {
          const history = await supportChatService.getChatMessages(
            existingChat.id,
          );
          if (!isActual) return;
          setMessages(sortMessages(history));
        } else {
          setMessages([]);
        }
      } catch (loadError) {
        if (!isActual) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Не удалось загрузить чат поддержки',
        );
      } finally {
        if (isActual) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isActual = false;
    };
  }, [user]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const ensureJoined = useCallback(async (): Promise<number> => {
    if (!user) {
      throw new Error('Необходимо авторизоваться');
    }

    const socket = socketRef.current;
    if (!socket) {
      throw new Error('Соединение с чатом недоступно');
    }

    if (joinedChatIdRef.current) {
      return joinedChatIdRef.current;
    }

    const joinPayload = {
      chatId: chat?.id,
      customerId: user.id,
      userId: user.id,
      role: 'customer',
      limit: 200,
    };

    const join = () =>
      new Promise<number>((resolve, reject) => {
        socket.emit('support:join', joinPayload, (ack: unknown) => {
          if (!ack || typeof ack !== 'object') {
            reject(new Error('Не удалось подключиться к чату'));
            return;
          }

          const response = ack as {
            status?: string;
            message?: string;
            data?: unknown;
          };

          if (response.status !== 'ok' || !response.data) {
            reject(
              new Error(response.message ?? 'Не удалось подключиться к чату'),
            );
            return;
          }

          try {
            const parsed = supportJoinResponseSchema.parse(response.data);
            setChat(parsed.chat);
            setMessages((prev) => mergeMessageLists(prev, parsed.messages));
            joinedChatIdRef.current = parsed.chatId;
            resolve(parsed.chatId);
          } catch (parseError) {
            reject(
              parseError instanceof Error
                ? parseError
                : new Error('Некорректный ответ сервера'),
            );
          }
        });
      });

    if (!socket.connected) {
      return new Promise<number>((resolve, reject) => {
        const onConnect = () => {
          socket.off('connect_error', onConnectError);
          join().then(resolve).catch(reject);
        };

        const onConnectError = (err: unknown) => {
          socket.off('connect', onConnect);
          reject(
            err instanceof Error
              ? err
              : new Error('Не удалось установить соединение'),
          );
        };

        socket.once('connect', onConnect);
        socket.once('connect_error', onConnectError);
        socket.connect();
      });
    }

    return join();
  }, [chat?.id, user]);

  const handleSendMessage = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSend) return;

      try {
        setIsSending(true);
        setError(null);

        const chatId = await ensureJoined();
        const socket = socketRef.current;
        if (!socket) {
          throw new Error('Соединение с чатом недоступно');
        }

        await new Promise<void>((resolve, reject) => {
          socket.emit(
            'support:message',
            {
              chatId,
              customerId: user?.id,
              body: messageText.trim(),
              senderType: 'customer',
            },
            (ack: unknown) => {
              if (!ack || typeof ack !== 'object') {
                reject(new Error('Не удалось отправить сообщение'));
                return;
              }

              const response = ack as {
                status?: string;
                message?: string;
                data?: unknown;
              };

              if (response.status !== 'ok' || !response.data) {
                reject(
                  new Error(
                    response.message ?? 'Не удалось отправить сообщение',
                  ),
                );
                return;
              }

              try {
                const parsed = supportMessageSchema.parse(response.data);
                appendMessage(parsed);
                resolve();
              } catch (parseError) {
                reject(
                  parseError instanceof Error
                    ? parseError
                    : new Error('Некорректный ответ сервера'),
                );
              }
            },
          );
        });

        setMessageText('');
      } catch (sendError) {
        setError(
          sendError instanceof Error
            ? sendError.message
            : 'Не удалось отправить сообщение',
        );
      } finally {
        setIsSending(false);
      }
    },
    [appendMessage, canSend, ensureJoined, messageText, user?.id],
  );

  if (!user) {
    return (
      <div className="support-chat">
        <Alert
          type="warning"
          message="Необходима авторизация"
          description="Чтобы написать в поддержку, войдите в аккаунт."
        />
      </div>
    );
  }

  return (
    <div className="support-chat">
      <div className="support-chat__container">
        <Typography.Title level={3}>Чат с поддержкой</Typography.Title>
        {chat?.admin && (
          <Typography.Paragraph className="support-chat__admin">
            Ваш менеджер: {chat.admin.name ?? 'Администратор'}
          </Typography.Paragraph>
        )}
        <div className="support-chat__messages" ref={messageListRef}>
          {isLoading ? (
            <div className="support-chat__loader">
              <Spin tip="Загрузка истории..." />
            </div>
          ) : messages.length === 0 ? (
            <div className="support-chat__empty">
              Напишите ваше сообщение, чтобы начать диалог с поддержкой.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`support-chat__message ${
                  msg.senderRole === 'customer'
                    ? 'support-chat__message--outgoing'
                    : 'support-chat__message--incoming'
                }`}
              >
                <div className="support-chat__message-text">
                  {msg.body ?? '[вложение]'}
                </div>
                <div className="support-chat__message-meta">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        <form className="support-chat__form" onSubmit={handleSendMessage}>
          <Input.TextArea
            rows={2}
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="Опишите вашу проблему..."
            disabled={isSending}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
          <Button
            type="primary"
            htmlType="submit"
            disabled={!canSend}
            loading={isSending}
            className="support-chat__submit"
          >
            Отправить
          </Button>
        </form>

        {error && (
          <Alert
            className="support-chat__alert"
            type="error"
            message={error}
            showIcon
          />
        )}
      </div>
    </div>
  );
}

