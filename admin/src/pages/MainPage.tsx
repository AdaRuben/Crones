
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect, useState } from "react";
import type { Order } from "@/entities/order/model/type";
import EditOrder from "@/features/editStatus/EditOrder";
import OrderCards from "@/entities/order/ui/PostCards";
import { fetchOrders } from "@/entities/order/model/thunks";


export default function MainPage(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const orders = useAppSelector(state => state.order.orders);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [editing, setEditing] = useState<Order | null>(null);


    useEffect(() => {
      void dispatch(fetchOrders());
    }, [dispatch]);

    const handleEdit = (post: Order): void => {
      setEditing(post);
      setVisibleEdit(true);
    }


  return (
     <div>
      <h2 className="page-header">Posts</h2>
      <div className="posts-container">
        {visibleEdit && <EditOrder setVisibleEdit={setVisibleEdit} editing={editing}/>}
        {orders.map(order => (
          <div key={order.id} className="post-card">
            <OrderCards order={order} actions = {
              <>
            <button onClick={() => handleEdit(order)}>Редактировать</button>
            {/* <DeleteButton id={post.id}/> */}
            </>
            }/>
          </div>
        ))}
      </div>
    </div>
  )
}
