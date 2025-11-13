import React, { useState, useEffect } from 'react';
import type { Order, newOrder } from '../model/type';
import { Button, Card, Flex, Select, App } from 'antd';
import { useAppDispatch } from '@/shared/hooks';
import { setStatus } from '../model/slice';
import { editOrder } from '../model/thunks';
import { EditOutlined } from '@ant-design/icons';
import EditOrder from '@/features/editStatus/EditOrder';
import ChoiceDriver from '@/features/choiseDriver/ChoiceDriver';


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
  const [chooseDriverOpen, setChooseDriverOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Order['status'] | null>(null);
  const { notification } = App.useApp();

  useEffect(() => {
    console.log('👁️ visibleEdit изменился:', visibleEdit);
  }, [visibleEdit]);

  const formatDate = (date: Date | string | null | undefined): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    if (!date) return '-';

    return new Date(date).toLocaleDateString('ru-RU', options);
  };

  const handleEdit = (): void => {
      console.log('📝 Открытие формы редактирования', order.id);
      setEditing(order);
      setVisibleEdit(true);
    }
  const handleStatusChange = async (newStatus: Order['status']): Promise<void> => {
    // Validation: finished requires payment
    if (newStatus === 'finished' && !order.isPaid) {
      notification.error({ message: 'Нельзя завершить неоплаченный заказ.' });
      return;
    }
    // Validation: cannot move finished -> new
    if (order.status === 'finished' && newStatus === 'new') {
      notification.error({ message: 'Завершенный заказ нельзя перевести в статус Новый.' });
      return;
    }
    // If switching to in process and no driver assigned -> open modal
    if (newStatus === 'in process' && (order.driverId == null)) {
      setPendingStatus(newStatus);
      setChooseDriverOpen(true);
      return;
    }

    dispatch(setStatus({ id: order.id, status: newStatus }));

    try {
      const orderBody: newOrder = {
        customerId: order.customerId,
        driverId: order.driverId ?? null,
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
      notification.success({ message: 'Статус заказа обновлен' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Ошибка при обновлении статуса:', msg);
      notification.error({ message: 'Ошибка при обновлении статуса' });
      dispatch(setStatus({ id: order.id, status: order.status }));
    }
  };

  const handleDriverSelected = async (driverId: number): Promise<void> => {
    if (!pendingStatus) {
      setChooseDriverOpen(false);
      return;
    }
    setChooseDriverOpen(false);
    // Optimistically set status
    dispatch(setStatus({ id: order.id, status: pendingStatus }));
    try {
      const orderBody: newOrder = {
        customerId: order.customerId,
        driverId,
        from: order.from,
        to: order.to,
        totalCost: order.totalCost,
        status: pendingStatus,
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
      notification.success({ message: 'Водитель назначен, статус обновлен' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Ошибка при назначении водителя:', msg);
      notification.error({ message: 'Не удалось назначить водителя' });
      dispatch(setStatus({ id: order.id, status: order.status }));
    } finally {
      setPendingStatus(null);
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
                {order.Customer && (
                  <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                    <strong>Информация о заказчике:</strong>
                    <p style={{ margin: '4px 0' }}>Имя: {order.Customer.name}</p>
                    <p style={{ margin: '4px 0' }}>Телефон: {order.Customer.phoneNumber}</p>
                  </div>
                )}
                {order.Driver && (
                  <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#e6f7ff', borderRadius: 4 }}>
                    <strong>Информация о водителе:</strong>
                    <p style={{ margin: '4px 0' }}>Имя: {order.Driver.name}</p>
                    <p style={{ margin: '4px 0' }}>Телефон: {order.Driver.phoneNumber}</p>
                  </div>
                )}
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
      <ChoiceDriver
        open={chooseDriverOpen}
        onCancel={() => {
          setChooseDriverOpen(false);
          setPendingStatus(null);
          notification.info({ message: 'Назначение водителя отменено' });
        }}
        onSelect={handleDriverSelected}
      />
    </>
  );
}