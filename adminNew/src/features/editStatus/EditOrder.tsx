import { useEffect, useState, useMemo } from 'react';
import { Button, Select, Input, Switch, Form, Space, App } from 'antd';
import { useAppDispatch } from '@/shared/hooks';
import type { Order, newOrder } from '@/entities/order/model/type';
import { editOrder } from '@/entities/order/model/thunks';
import axiosInstance from '@/shared/axiosInstance';

type Driver = {
  id: number;
  name: string;
  phoneNumber: string;
};

type EditOrderProps = {
  editing: Order | null;
  setVisibleEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditOrder({
  editing,
  setVisibleEdit,
}: EditOrderProps): React.JSX.Element | null {
  const dispatch = useAppDispatch();
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  // Загрузка списка водителей
  useEffect(() => {
    setLoadingDrivers(true);
    void axiosInstance
      .get<Driver[]>('/drivers')
      .then((res) => setDrivers(res.data))
      .catch((err) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Ошибка загрузки водителей:', msg);
      })
      .finally(() => setLoadingDrivers(false));
  }, []);

  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        from: editing.from,
        to: editing.to,
        totalCost: editing.totalCost,
        status: editing.status,
        isPaid: editing.isPaid,
        vehicle: editing.vehicle,
        adminComment: editing.adminComment ?? '',
        driverId: editing.driverId ?? undefined,
      });
    }
  }, [editing, form]);

  const driverOptions = useMemo(
    () =>
      drivers.map((d) => ({
        value: d.id,
        label: `${d.name} (${d.phoneNumber})`,
      })),
    [drivers],
  );

  if (!editing) return null;

  const handleSave = async (): Promise<void> => {
    console.log('🔵 handleSave вызван');
    try {
      console.log('🔵 Валидация формы...');
      const values = await form.validateFields();
      console.log('🔵 Значения формы:', values);

      const orderBody: newOrder = {
        customerId: editing.customerId,
        driverId: values.driverId ?? null,
        from: values.from,
        to: values.to,
        totalCost: values.totalCost,
        status: values.status,
        isPaid: values.isPaid,
        vehicle: values.vehicle,
        adminComment: values.adminComment,
        customerComment: editing.customerComment,
        finishedAt: editing.finishedAt,
        createdAt: editing.createdAt,
      };

      console.log('🔵 Отправка на сервер:', orderBody);
      await dispatch(
        editOrder({
          id: editing.id,
          order: orderBody,
        }),
      ).unwrap();

      console.log('🟢 Заказ успешно обновлен');
      notification.success({ message: 'Заказ успешно обновлен' });
      console.log('🟢 Закрытие формы...');
      setVisibleEdit(false);
    } catch (error) {
      console.error('🔴 Ошибка при сохранении:', error);
      notification.error({ message: 'Ошибка при обновлении заказа' });
    }
  };

  const handleCancel = (): void => {
    console.log('🟡 Отмена редактирования');
    setVisibleEdit(false);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Откуда"
          name="from"
          rules={[{ required: true, message: 'Укажите место отправления' }]}
        >
          <Input placeholder="Место отправления" />
        </Form.Item>

        <Form.Item
          label="Куда"
          name="to"
          rules={[{ required: true, message: 'Укажите место назначения' }]}
        >
          <Input placeholder="Место назначения" />
        </Form.Item>

        <Form.Item
          label="Стоимость"
          name="totalCost"
          rules={[{ required: true, message: 'Укажите стоимость' }]}
        >
          <Input placeholder="Стоимость" />
        </Form.Item>

        <Form.Item
          label="Статус заявки"
          name="status"
          rules={[{ required: true, message: 'Выберите статус' }]}
        >
          <Select style={{ width: '100%' }}>
            <Select.Option value="new">Новый</Select.Option>
            <Select.Option value="in process">В процессе</Select.Option>
            <Select.Option value="finished">Завершен</Select.Option>
            <Select.Option value="cancelled">Отменен</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Оплачено" name="isPaid" valuePropName="checked">
          <Switch checkedChildren="Да" unCheckedChildren="Нет" />
        </Form.Item>

        <Form.Item
          label="Тип кузова"
          name="vehicle"
          rules={[{ required: true, message: 'Выберите тип кузова' }]}
        >
          <Select style={{ width: '100%' }}>
            <Select.Option value="Седан">Седан</Select.Option>
            <Select.Option value="Кроссовер">Кроссовер</Select.Option>
            <Select.Option value="Внедорожник">Внедорожник</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Водитель"
          name="driverId"
        >
          <Select
            style={{ width: '100%' }}
            placeholder="Выберите водителя"
            loading={loadingDrivers}
            options={driverOptions}
            showSearch
            optionFilterProp="label"
            allowClear
          />
        </Form.Item>

        <Form.Item label="Примечание администратора" name="adminComment">
          <Input.TextArea rows={3} placeholder="Примечание администратора" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleSave}>
              Сохранить
            </Button>
            <Button onClick={handleCancel}>Закрыть</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
