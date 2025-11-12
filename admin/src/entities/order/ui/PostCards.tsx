import React, { useState } from 'react';
import type { Order } from '../model/type';
import { Button, Card, Flex, Select } from 'antd';
import { useAppDispatch } from '@/shared/hooks';
import { setStatus } from '../model/slice';
import { editOrder } from '../model/thunks';
import { EditOutlined } from '@ant-design/icons';
import EditOrder from '@/features/editOrder/EditOrder';

export default function OrderCards({
  order,
  actions,
}: {
  order: Order;
  actions: React.ReactNode;
}): React.JSX.Element {

  const dispatch = useAppDispatch();
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);

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

  const handleEdit = (): void => {
      setEditing(order);
      setVisibleEdit(true);
    }
  const handleStatusChange = async (newStatus: Order['status']): Promise<void> => {

    dispatch(setStatus({ id: order.id, status: newStatus }));
    
    try {
      const orderBody = {
        customerId: order.customerId,
        from: order.from,
        to: order.to,
        totalCost: order.totalCost,
        status: newStatus,
        isPaid: order.isPaid,
        vehicle: order.vehicle,
        adminComment: order.adminComment,
        customerComment: order.customerComment,
        finishedAt: order.finishedAt,
        createdAt: order.createdAt,
      };
      await dispatch(
        editOrder({
          id: order.id,
          order: orderBody,
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

                <Button onClick={handleEdit}><EditOutlined /></Button>
                {visibleEdit ? 
                <EditOrder setVisibleEdit={setVisibleEdit} editing={editing}/>
                :
                <>
                <p>Откуда: {order.from}</p>
                <p>Куда: {order.to}</p>
                <p>Стоимость: {order.totalCost}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Статус заявки:</span>
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
                    </div>
                <p>Оплачено: {order.isPaid ? 'Да' : 'Нет'}</p>
                <p>Тип кузова: {order.vehicle}</p>
                <p>Комментарий от заказчика: {order.customerComment}</p>
                <p>Примечание администратора: {order.adminComment}</p>
                <p>Дата завершения: {formatDate(order.finishedAt)}</p>
                <p>Дата создания: {formatDate(order.createdAt)}</p>
                </>
              }
              </>
            }
          />
          <div style={{ marginTop: 16 }}>{actions}</div>
        </Card>
      </Flex>
    </>
  );
}