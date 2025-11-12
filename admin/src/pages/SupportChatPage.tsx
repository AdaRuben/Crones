import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { Alert, Button, Input, List, Spin, Tag, Typography } from 'antd';
import { useAppSelector } from '@/shared/hooks';
import supportChatService from '@/entities/support-chat/api/supportChatService';
import type {
  SupportChat,
  SupportMessage,
} from '@/entities/support-chat/types/types';
import {
  supportJoinResponseSchema,
  supportMessageSchema,
} from '@/entities/support-chat/types/schema';
import './SupportChatPage.css';

const SOCKET_NAMESPACE = '/support';

const sortMessages = (messages: SupportMessage[]): SupportMessage[] =>
  [...messages].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

export default function SupportChatPage(): React.JSX.Element {
  const admin =
    useAppSelector((state) => state.user.users[state.user.users.length - 1]) ??
    null;

  const [assignedChats, setAssignedChats] = useState<SupportChat[]>([]);
  const [pendingChats, setPendingChats] = useState<SupportChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<SupportChat | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);

  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const joinedChatIdRef = useRef<number | null>(null);
  const selectedChatRef = useRef<SupportChat | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(
    () =>
      Boolean(
        admin && selectedChat && messageText.trim().length > 0 && !isSending,
      ),
    [admin, isSending, messageText, selectedChat],
  );

  const refreshChats = useCallback(async () => {
    if (!admin) return;
    setIsLoadingChats(true);
    try {
      const list = await supportChatService.getAdminChats(admin.id);
      setAssignedChats(list.assigned);
      setPendingChats(list.pending);
      return list;
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Не удалось загрузить список чатов',
      );
      return null;
    } finally {
      setIsLoadingChats(false);
    }
  }, [admin]);

  const loadMessages = useCallback(async (chat: SupportChat | null) => {
    if (!chat) {
      setMessages([]);
      return;
    }
    setIsLoadingMessages(true);
    try {
      const history = await supportChatService.getChatMessages(chat.id);
      setMessages(sortMessages(history));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Не удалось загрузить сообщения',
      );
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const socket = io(SOCKET_NAMESPACE, {
      path: '/socket.io',
      autoConnect: false,
      withCredentials: true,
    });
    socketRef.current = socket;

    const handleMessage = (payload: unknown) => {
      try {
        const parsed = supportMessageSchema.parse(payload);
        const currentChat = selectedChatRef.current;
        if (currentChat && parsed.chatId === currentChat.id) {
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === parsed.id)) return prev;
            return sortMessages([...prev, parsed]);
          });
        }
      } catch (parseError) {
        console.error('[admin support] failed to parse incoming message', parseError);
      }
    };

    const handleError = (payload: unknown) => {
      if (
        payload &&
        typeof payload === 'object' &&
        'message' in payload &&
        typeof payload.message === 'string'
      ) {
        setError(payload.message);
      } else {
        setError('Ошибка соединения с чатом поддержки');
      }
    };

    socket.on('support:message', handleMessage);
    socket.on('support:error', handleError);

    return () => {
      socket.off('support:message', handleMessage);
      socket.off('support:error', handleError);
      socket.disconnect();
      socketRef.current = null;
      joinedChatIdRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!admin) return;
    void refreshChats();
  }, [admin, refreshChats]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const ensureJoined = useCallback(async (chat: SupportChat): Promise<number> => {
    if (!admin) {
      throw new Error('Необходима авторизация администратора');
    }
    const socket = socketRef.current;
    if (!socket) {
      throw new Error('Соединение с чатом недоступно');
    }

    if (joinedChatIdRef.current === chat.id && socket.connected) {
      return chat.id;
    }

    const joinPayload = {
      chatId: chat.id,
      customerId: chat.customerId,
      adminId: admin.id,
      userId: admin.id,
      role: 'admin',
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
            joinedChatIdRef.current = parsed.chatId;
            selectedChatRef.current = chat;
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
  }, [admin]);

  const handleSendMessage = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSend) return;

      try {
        setIsSending(true);
        setError(null);
        if (!selectedChat) {
          throw new Error('Выберите чат');
        }
        const chatId = await ensureJoined(selectedChat);
        const socket = socketRef.current;
        if (!socket) {
          throw new Error('Соединение с чатом недоступно');
        }

        await new Promise<void>((resolve, reject) => {
          socket.emit(
            'support:message',
            {
              chatId,
              adminId: admin?.id,
              customerId: selectedChat?.customerId,
              body: messageText.trim(),
              senderType: 'admin',
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
                setMessages((prev) => {
                  if (prev.some((msg) => msg.id === parsed.id)) return prev;
                  return sortMessages([...prev, parsed]);
                });
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
        const list = await refreshChats();
        if (list && selectedChat) {
          const updated =
            list.assigned.find((chat) => chat.id === selectedChat.id) ??
            list.pending.find((chat) => chat.id === selectedChat.id) ??
            null;
          if (updated) {
            setSelectedChat(updated);
          }
        }
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
    [admin?.id, canSend, ensureJoined, messageText, refreshChats, selectedChat],
  );

  const handleSelectChat = useCallback(
    async (chat: SupportChat) => {
      setSelectedChat(chat);
      await loadMessages(chat);
      if (chat.adminId === null) {
        try {
          await ensureJoined(chat);
          const list = await refreshChats();
          if (list) {
            const updated =
              list.assigned.find((entry) => entry.id === chat.id) ??
              list.pending.find((entry) => entry.id === chat.id) ??
              null;
            if (updated) {
              setSelectedChat(updated);
            }
          }
        } catch (joinError) {
          setError(
            joinError instanceof Error
              ? joinError.message
              : 'Не удалось присоединиться к чату',
          );
        }
      }
    },
    [ensureJoined, loadMessages, refreshChats],
  );

  if (!admin) {
    return (
      <div className="admin-support-chat">
        <Alert
          type="warning"
          message="Необходима авторизация"
          description="Войдите в аккаунт администратора, чтобы работать с чатами поддержки."
        />
      </div>
    );
  }

  return (
    <div className="admin-support-chat">
      <div className="admin-support-chat__sidebar">
        <Typography.Title level={4}>Чаты поддержки</Typography.Title>
        {isLoadingChats ? (
          <div className="admin-support-chat__state">
            <Spin tip="Загрузка чатов..." />
          </div>
        ) : (
          <>
            <Typography.Title level={5}>Назначенные</Typography.Title>
            <List
              className="admin-support-chat__list"
              locale={{ emptyText: 'Нет активных диалогов' }}
              dataSource={assignedChats}
              renderItem={(item) => (
                <List.Item
                  className={
                    selectedChat?.id === item.id
                      ? 'admin-support-chat__list-item admin-support-chat__list-item--active'
                      : 'admin-support-chat__list-item'
                  }
                  onClick={() => void handleSelectChat(item)}
                >
                  <div>
                    <div className="admin-support-chat__list-title">
                      Клиент #{item.customerId}
                    </div>
                    {item.customer?.name && (
                      <div className="admin-support-chat__list-subtitle">
                        {item.customer.name}
                      </div>
                    )}
                  </div>
                  <Tag color={item.status === 'open' ? 'green' : 'default'}>
                    {item.status === 'open' ? 'Открыт' : 'Закрыт'}
                  </Tag>
                </List.Item>
              )}
            />

            <Typography.Title level={5}>Ожидающие</Typography.Title>
            <List
              className="admin-support-chat__list"
              locale={{ emptyText: 'Новых обращений нет' }}
              dataSource={pendingChats}
              renderItem={(item) => (
                <List.Item
                  className={
                    selectedChat?.id === item.id
                      ? 'admin-support-chat__list-item admin-support-chat__list-item--active'
                      : 'admin-support-chat__list-item'
                  }
                  onClick={() => void handleSelectChat(item)}
                >
                  <div>
                    <div className="admin-support-chat__list-title">
                      Клиент #{item.customerId}
                    </div>
                    {item.customer?.name && (
                      <div className="admin-support-chat__list-subtitle">
                        {item.customer.name}
                      </div>
                    )}
                  </div>
                  <Tag color="orange">Новый</Tag>
                </List.Item>
              )}
            />
          </>
        )}
      </div>

      <div className="admin-support-chat__content">
        {selectedChat ? (
          <>
            <div className="admin-support-chat__header">
              <div>
                <Typography.Title level={4} style={{ marginBottom: 0 }}>
                  Клиент #{selectedChat.customerId}
                </Typography.Title>
                {selectedChat.customer?.name && (
                  <Typography.Text type="secondary">
                    {selectedChat.customer.name}
                    {selectedChat.customer.phoneNumber
                      ? ` · ${selectedChat.customer.phoneNumber}`
                      : ''}
                  </Typography.Text>
                )}
              </div>
              <Tag color={selectedChat.status === 'open' ? 'green' : 'default'}>
                {selectedChat.status === 'open' ? 'Открыт' : 'Закрыт'}
              </Tag>
            </div>

            <div className="admin-support-chat__messages" ref={messageListRef}>
              {isLoadingMessages ? (
                <div className="admin-support-chat__state">
                  <Spin tip="Загрузка переписки..." />
                </div>
              ) : messages.length === 0 ? (
                <div className="admin-support-chat__state">
                  Нет сообщений. Начните диалог, чтобы помочь клиенту.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`admin-support-chat__message ${
                      msg.senderRole === 'admin'
                        ? 'admin-support-chat__message--outgoing'
                        : 'admin-support-chat__message--incoming'
                    }`}
                  >
                    <div className="admin-support-chat__message-text">
                      {msg.body ?? '[вложение]'}
                    </div>
                    <div className="admin-support-chat__message-meta">
                      {msg.senderRole === 'admin' ? 'Вы' : 'Клиент'} ·{' '}
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              className="admin-support-chat__form"
              onSubmit={handleSendMessage}
            >
              <Input.TextArea
                rows={3}
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Введите ответ клиенту..."
                disabled={isSending}
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
              <Button
                type="primary"
                htmlType="submit"
                disabled={!canSend}
                loading={isSending}
              >
                Отправить
              </Button>
            </form>
          </>
        ) : (
          <div className="admin-support-chat__state">
            Выберите чат, чтобы просмотреть переписку и ответить клиенту.
          </div>
        )}

        {error && (
          <Alert
            className="admin-support-chat__alert"
            type="error"
            message={error}
            showIcon
            closable
            onClose={() => setError(null)}
          />
        )}
      </div>
    </div>
  );
}

