import React from 'react'
import type { Order } from '../model/type'

import { Avatar, Card, Flex, Switch } from 'antd';

export default function OrderCards({order, actions}: {order: Order, actions: React.ReactNode}): React.JSX.Element {
  
   const formatDate = (date: Date | string | null | undefined): string => {

const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
if (!date) return '-';
console.log(date);

return new Date(date).toLocaleDateString("ru-RU", options);
  };

  return (
   
      <> <Flex gap="middle" align="start" vertical>
      <Card  style={{ minWidth: 300 }}>
        <Card.Meta
          title={`Заказ №${(order.id).toString()}`}
          description={
            <>
             <p>Откуда: {order.from}</p>
             <p> Куда: {order.to}</p>
             <p>Стоимость: {order.totalCost}</p>
             <p>Стасус заявки: {order.status}</p>
             <p>Оплачено:{order.isPaid}</p>
             <p>Тип кузова:{order.vehicle}</p>
             <p>Комментарий от закзачика: {order.customerComment}</p>
      <p>Примечание администратора: {order.adminComment}</p>
      <p>Дата завершения: {formatDate(order.finishedAt)}</p>
      <p>Дата создания: {formatDate(order.createdAt)}</p> 
            </>
          }
        />
      </Card>
    </Flex></>

  )
}
