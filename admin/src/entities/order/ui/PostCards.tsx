import React from 'react';
import type { Order } from '../model/type';
import { Card, Flex, Select } from 'antd';
import { useAppDispatch } from '@/shared/hooks';
import { setStatus } from '../model/slice';
import { editOrder } from '../model/thunks';

export default function OrderCards({
  order,
  actions,
}: {
  order: Order;
  actions: React.ReactNode;
}): React.JSX.Element {
  const dispatch = useAppDispatch();

  const formatDate = (date: Date | string | null | undefined): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    if (!date) return '-';
    console.log(date);

    return new Date(date).toLocaleDateString('ru-RU', options);
  };

  const handleStatusChange = async (newStatus: Order['status']) => {

    dispatch(setStatus({ id: order.id, status: newStatus }));
    
    try {
      await dispatch(
        editOrder({
          id: order.id,
          order: { ...order, status: newStatus },
        })
      ).unwrap();
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);

      dispatch(setStatus({ id: order.id, status: order.status }));
    }
  };

  return (
    <>
      <Flex gap="middle" align="start" vertical>
        <Card style={{ minWidth: 300 }}>
          <Card.Meta
            title={`Заказ №${order.id.toString()}`}
            description={
              <>
                <p>Откуда: {order.from}</p>
                <p>Куда: {order.to}</p>
                <p>Стоимость: {order.totalCost}</p>
                <p>
                  Стасус заявки:{' '}
                  <Select
                    value={order.status}
                    style={{ width: 150 }}
                    onChange={handleStatusChange}
                  >
                    <Select.Option value="new">Новый</Select.Option>
                    <Select.Option value="in process">В процессе</Select.Option>
                    <Select.Option value="finished">Завершен</Select.Option>
                    <Select.Option value="cancelled">Отменен</Select.Option>
                  </Select>
                </p>
                <p>Оплачено: {order.isPaid ? 'Да' : 'Нет'}</p>
                <p>Тип кузова: {order.vehicle}</p>
                <p>Комментарий от заказчика: {order.customerComment}</p>
                <p>Примечание администратора: {order.adminComment}</p>
                <p>Дата завершения: {formatDate(order.finishedAt)}</p>
                <p>Дата создания: {formatDate(order.createdAt)}</p>
              </>
            }
          />
          <div style={{ marginTop: 16 }}>{actions}</div>
        </Card>
      </Flex>
    </>
  );
}