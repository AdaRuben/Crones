import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/api/hooks';
import { fetchAllOrders, cancelOrder, updateCustomerComment } from '@/entities/orders/model/thunks';
import type { Order } from '@/entities/orders/types/types';
import {
  List,
  Card,
  Tag,
  Typography,
  Space,
  Spin,
  Empty,
  Alert,
  Button,
  Input,
  Modal,
  message,
} from 'antd';
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CommentOutlined,
  EditOutlined,
  StopOutlined,
} from '@ant-design/icons';
import './OrderHistoryPage.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function OrderHistoryPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const error = useAppSelector((state) => state.orders.error);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [commentValue, setCommentValue] = useState('');

  useEffect(() => {
    void dispatch(fetchAllOrders()).finally(() => setLoading(false));
  }, [dispatch]);

  const getStatusTag = (status: Order['status']): React.JSX.Element => {
    const statusConfig = {
      new: { color: 'blue', text: 'Новый', icon: <ClockCircleOutlined /> },
      'in process': { color: 'orange', text: 'В процессе', icon: <CarOutlined /> },
      finished: { color: 'green', text: 'Завершен', icon: <CheckCircleOutlined /> },
      cancelled: { color: 'red', text: 'Отменен', icon: <CloseCircleOutlined /> },
    };

    const config = statusConfig[status];
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const handleCancelOrder = (orderId: number): void => {
    Modal.confirm({
      title: 'Отменить заказ?',
      content: 'Вы уверены, что хотите отменить этот заказ?',
      okText: 'Да, отменить',
      cancelText: 'Нет',
      okType: 'danger',
      onOk: async () => {
        try {
          await dispatch(cancelOrder(orderId)).unwrap();
          message.success('Заказ успешно отменен');
        } catch {
          message.error('Не удалось отменить заказ');
        }
      },
    });
  };

  const handleEditComment = (orderId: number, currentComment?: string): void => {
    setEditingCommentId(orderId);
    setCommentValue(currentComment ?? '');
  };

  const handleSaveComment = async (orderId: number): Promise<void> => {
    try {
      await dispatch(
        updateCustomerComment({ id: orderId, customerComment: commentValue }),
      ).unwrap();
      message.success('Комментарий сохранен');
      setEditingCommentId(null);
    } catch {
      message.error('Не удалось сохранить комментарий');
    }
  };

  const handleCancelEdit = (): void => {
    setEditingCommentId(null);
    setCommentValue('');
  };

  if (loading) {
    return (
      <div className="order-history-loading">
        <Spin size="large" tip="Загрузка заказов..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-error">
        <Alert message="Ошибка загрузки" description={error} type="error" showIcon />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-history-empty">
        <Empty description="У вас пока нет заказов" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => b.id - a.id);

  return (
    <div className="order-history-page">
      <Title level={2} className="order-history-title">
        История заказов
      </Title>

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        dataSource={sortedOrders}
        renderItem={(order) => (
          <List.Item>
            <Card
              className="order-card"
              title={
                <Space>
                  <Text strong>Заказ #{order.id}</Text>
                  {getStatusTag(order.status)}
                </Space>
              }
              extra={
                (order.status === 'new' || order.status === 'in process') && (
                  <Button
                    type="text"
                    danger
                    icon={<StopOutlined />}
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Отменить
                  </Button>
                )
              }
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {/* Маршрут */}
                <div>
                  <Text type="secondary">
                    <EnvironmentOutlined /> Маршрут:
                  </Text>
                  <Paragraph className="route-text">
                    <Text strong>{order.from}</Text>
                    <Text type="secondary"> → </Text>
                    <Text strong>{order.to}</Text>
                  </Paragraph>
                </div>

                {/* Транспорт */}
                <div>
                  <Text type="secondary">
                    <CarOutlined /> Транспорт:
                  </Text>
                  <Text strong> {order.vehicle}</Text>
                </div>

                {/* Стоимость */}
                {order.totalCost !== null && (
                  <div>
                    <Text type="secondary">
                      <DollarOutlined /> Стоимость:
                    </Text>
                    <Text strong> {order.totalCost} ₽</Text>
                    {order.isPaid !== null && (
                      <Tag color={order.isPaid ? 'green' : 'orange'} style={{ marginLeft: 8 }}>
                        {order.isPaid ? 'Оплачено' : 'Не оплачено'}
                      </Tag>
                    )}
                  </div>
                )}

                {/* Комментарий клиента */}
                <div>
                  <Text type="secondary">
                    <CommentOutlined /> Комментарий:
                  </Text>
                  {editingCommentId === order.id ? (
                    <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                      <TextArea
                        value={commentValue}
                        onChange={(e) => setCommentValue(e.target.value)}
                        placeholder="Добавьте комментарий..."
                        rows={3}
                      />
                      <Space>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleSaveComment(order.id)}
                        >
                          Сохранить
                        </Button>
                        <Button size="small" onClick={handleCancelEdit}>
                          Отмена
                        </Button>
                      </Space>
                    </Space>
                  ) : (
                    <div style={{ marginTop: 8 }}>
                      {order.customerComment ? (
                        <Paragraph>
                          {order.customerComment}
                          <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEditComment(order.id, order.customerComment)}
                          >
                            Редактировать
                          </Button>
                        </Paragraph>
                      ) : (
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEditComment(order.id)}
                        >
                          Добавить комментарий
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Комментарий администратора
                {order.adminComment && (
                  <Alert
                    message="Комментарий администратора"
                    description={order.adminComment}
                    type="info"
                    showIcon
                  />
                )} */}

                {/* Дата завершения */}
                {order.finishedAt && (
                  <Text type="secondary">
                    Завершен: {new Date(order.finishedAt).toLocaleString('ru-RU')}
                  </Text>
                )}
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
