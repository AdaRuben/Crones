import { useAppDispatch, useAppSelector } from '@/shared/hooks';
import { useEffect, useState } from 'react';
import OrderCards from '@/entities/order/ui/PostCards';
import { fetchOrders } from '@/entities/order/model/thunks';
import { Input, Select } from 'antd';

export default function MainPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.order.orders);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchCriteria, setSearchCriteria] = useState<string>('orderId');
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    void dispatch(fetchOrders());
  }, [dispatch]);

  // Сортировка заказов по номеру заказа (по убыванию)
  const sortedOrders = [...orders].sort(
    (a, b) => b.id - a.id, // По убыванию номера заказа
  );

  // Фильтрация заказов
  const filteredOrders = sortedOrders.filter((order) => {
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    const paymentMatch =
      paymentFilter === 'all' ||
      (paymentFilter === 'paid' && order.isPaid) ||
      (paymentFilter === 'unpaid' && !order.isPaid);

    // Поиск по выбранному критерию
    let searchMatch = true;
    if (searchValue !== '') {
      if (searchCriteria === 'orderId') {
        searchMatch = order.id.toString().includes(searchValue);
      } else if (searchCriteria === 'phone') {
        searchMatch = order.Customer?.phoneNumber
          ? order.Customer.phoneNumber.includes(searchValue)
          : false;
      }
    }

    return statusMatch && paymentMatch && searchMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20 }}>
      <div style={{ marginBottom: 20, width: '800px' }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ marginRight: 8 }}>Поиск:</label>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={
              searchCriteria === 'orderId' ? 'Введите номер заказа' : 'Введите номер телефона'
            }
            style={{ width: 500 }}
            addonBefore={
              <Select
                value={searchCriteria}
                onChange={setSearchCriteria}
                style={{ width: 150 }}
                options={[
                  { value: 'orderId', label: 'Номер заказа' },
                  { value: 'phone', label: 'Телефон' },
                ]}
              />
            }
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <label style={{ marginRight: 8 }}>Статус:</label>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 200 }}
              options={[
                { value: 'all', label: 'Все' },
                { value: 'new', label: 'Новый' },
                { value: 'in process', label: 'В процессе' },
                { value: 'finished', label: 'Завершен' },
              ]}
            />
          </div>

          <div>
            <label style={{ marginRight: 8 }}>Оплата:</label>
            <Select
              value={paymentFilter}
              onChange={setPaymentFilter}
              style={{ width: 200 }}
              options={[
                { value: 'all', label: 'Все' },
                { value: 'paid', label: 'Оплачено' },
                { value: 'unpaid', label: 'Не оплачено' },
              ]}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        {filteredOrders.map((order) => (
          <div key={order.id}>
            <OrderCards order={order} actions={null} />
          </div>
        ))}
      </div>
    </div>
  );
}
