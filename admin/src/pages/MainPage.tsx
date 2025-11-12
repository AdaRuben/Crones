import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect } from "react";
import OrderCards from "@/entities/order/ui/PostCards";
import { fetchOrders } from "@/entities/order/model/thunks";

export default function MainPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(state => state.order.orders);

  useEffect(() => {
    void dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div>
      <h2 className="page-header">Заказы</h2>
      <div className="posts-container">
        {orders.map(order => (
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