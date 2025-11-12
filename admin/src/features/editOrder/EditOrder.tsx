import { orderAllSchema } from '@/entities/order/model/schema';
import { editOrder } from '@/entities/order/model/thunks';
import { useAppDispatch } from '@/shared/hooks';
import type { Order } from '@/entities/order/model/type';
import { Button, Input, InputNumber, Space, Switch, Select, App } from 'antd';
import React, { useState } from 'react';

export default function EditPost({
  setVisibleEdit,
  editing,
}: {
  setVisibleEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editing: Order | null;
}): React.JSX.Element | null {
  const dispatch = useAppDispatch();
  const [isPaid, setIsPaid] = useState(editing?.isPaid ?? false);
  const { notification } = App.useApp();

  if (!editing) return null;

  // const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //  if (!editing || !editing.id) {
  //   console.error('Ошибка: editing или editing.id не определены', { editing });
  //   return;
  // }

  // const formData = new FormData(e.currentTarget);

  // // Безопасное преобразование FormData значений в строки
  // const getStringValue = (key: string): string => {
  //   const value = formData.get(key);
  //   if (value === null) return '';
  //   if (typeof value === 'string') return value;
  //   if (value instanceof File) return value.name; // для файлов
  //   return String(value);
  // };

  // // Собираем данные из формы
  // const formFields = {
  //   from: getStringValue('from') || editing.from,
  //   to: getStringValue('to') || editing.to,
  //   totalCost: getStringValue('totalCost') || editing.totalCost,
  //   vehicle: getStringValue('vehicle') || editing.vehicle,
  //   adminComment: getStringValue('adminComment') || null,
  // };

  //   // Валидируем поля формы
  //   const validFormData = orderAllSchema.parse({
  //     ...formFields,
  //     isPaid: isPaid, // добавляем isPaid из state
  //   });

  //   // Формируем полный объект для newOrder (со всеми обязательными полями)
  //   const orderData = {
  //     ...validFormData,
  //     customerId: editing.customerId, // из исходного заказа
  //     status: editing.status, // из исходного заказа
  //     customerComment: editing.customerComment, // из исходного заказа
  //     finishedAt: editing.finishedAt, // из исходного заказа
  //     createdAt: editing.createdAt, // из исходного заказа
  //   };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
  e.preventDefault();

  if (!editing.id) {
    console.error('Ошибка: editing или editing.id не определены', { editing });
    return;
  }

  try {
    const formData = new FormData(e.currentTarget);

    const getStringValue = (key: string): string => {
      const value = formData.get(key);
      if (value === null) return '';
      if (typeof value === 'string') return value;
      if (value instanceof File) return value.name;
      return String(value);
    };

    const formFields = {
      from: getStringValue('from') || editing.from,
      to: getStringValue('to') || editing.to,
      totalCost: (getStringValue('totalCost') || editing.totalCost),
      vehicle: getStringValue('vehicle') || editing.vehicle,
      adminComment: getStringValue('adminComment') || null,
    };

    const validFormData = orderAllSchema.parse({
      ...formFields,
      isPaid,
    });

    const orderData = {
      ...validFormData,
      customerId: editing.customerId,
      status: editing.status,
      customerComment: editing.customerComment,
      finishedAt: editing.finishedAt,
      createdAt: editing.createdAt,
    };

    console.log('Отправляем данные:', orderData);
    
    await dispatch(editOrder({ id: editing.id, order: orderData })).unwrap();
    notification.success({ message: 'Заказ успешно обновлён' });
    setVisibleEdit(false);
  } catch (err) {
    console.error('Не удалось обновить заказ:', err);
    notification.error({ message: 'Не удалось обновить заказ' });
  }
};

  return (
    <form onSubmit={submitHandler}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <label>
          Откуда:
          <Input name="from" defaultValue={editing.from} />
        </label>
        <label>
          Куда:
          <Input name="to" defaultValue={editing.to} />
        </label>
        <label>
          Стоимость:
          <InputNumber name="totalCost" defaultValue={Number(editing.totalCost)} />
        </label>
        <label>
          Оплачено:
          <Switch checked={isPaid} onChange={setIsPaid} />
        </label>
        <label>
          Тип кузова:
          <Select
            style={{ width: '100%' }}
            defaultValue={editing.vehicle}
            onChange={(value) => {
              // Mirror Select value to a hidden input so FormData picks it up
              const hidden = document.getElementById('vehicle-hidden') as HTMLInputElement | null;
              if (hidden) hidden.value = value;
            }}
            options={[
              { label: 'Внедорожник', value: 'Внедорожник' },
              { label: 'Седан/Кроссовер', value: 'Седан/Кроссовер' },
            ]}
          />
          <input id="vehicle-hidden" name="vehicle" type="hidden" defaultValue={editing.vehicle} />
        </label>
        <label>
          Примечание администратора:
          <Input.TextArea name="adminComment" defaultValue={editing.adminComment ?? ''} />
        </label>
        <Space>
          <Button type="primary" htmlType="submit">Сохранить</Button>
        </Space>
      </Space>
    </form>
  );
}