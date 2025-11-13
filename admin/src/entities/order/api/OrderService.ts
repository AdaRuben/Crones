// import axios from "axios";
import type { newOrder, Order } from '../model/type';
import { orderSchema } from '../model/schema';
import axiosInstance from '@/shared/axiosInstance';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class OrderService {
  static async getOrders(): Promise<Order[]> {
    try {
      const orders = await axiosInstance.get('/orders/');
      const data = orderSchema.array().parse(orders.data);
      // console.log('----------------', data);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw error;
    }
  }

  static async editOrder(id: Order['id'], order: newOrder): Promise<Order> {
    try {
      const res = await axiosInstance.put(`/orders/${id.toString()}`, order);
      return orderSchema.parse(res.data);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw error;
    }
  }
}

export default OrderService;
