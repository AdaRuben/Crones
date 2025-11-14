
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect, useState } from "react";
import OrderCards from "@/entities/order/ui/PostCards";
import { fetchOrders } from "@/entities/order/model/thunks";
import { Select } from "antd";


export default function MainPage(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const orders = useAppSelector(state => state.order.orders);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [paymentFilter, setPaymentFilter] = useState<string>("all");

    useEffect(() => {
      void dispatch(fetchOrders());
    }, [dispatch]);

    // Сортировка заказов по номеру заказа (по убыванию)
    const sortedOrders = [...orders].sort((a, b) => {
      return b.id - a.id; // По убыванию номера заказа
    });

    // Фильтрация заказов
    const filteredOrders = sortedOrders.filter((order) => {
      const statusMatch = statusFilter === "all" || order.status === statusFilter;
      const paymentMatch = paymentFilter === "all" ||
                          (paymentFilter === "paid" && order.isPaid) ||
                          (paymentFilter === "unpaid" && !order.isPaid);
      return statusMatch && paymentMatch;
    });


 return (
  <div>
    <h2 className="page-header">Posts</h2>

    <div style={{ marginBottom: 20, display: 'flex', gap: 16 }}>
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

    <div className="posts-container">
      {filteredOrders.map((order) => (
        <div key={order.id} className="post-card">
          <OrderCards
            order={order}
            actions={null}
          />
        </div>
      ))}
    </div>
  </div>
);
}
