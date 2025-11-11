import axiosInstance from '@/shared/axiosInstance';
import type { NewOrder, Order } from '../types/types';
import { orderSchema } from '../types/schema';

/* eslint-disable @typescript-eslint/no-extraneous-class */
class OrderService {
  static async fetchAllOrders(): Promise<Order[]> {
    const response = await axiosInstance.get('/customer/orders');
    return orderSchema.array().parse(response.data);
  }

  static async fetchOrderById(id: number): Promise<Order> {
    const response = await axiosInstance.get(`/customer/orders/${id.toString()}`);
    return orderSchema.parse(response.data);
  }

  static async createOrder(order: NewOrder): Promise<Order> {
    const response = await axiosInstance.post('/customer/orders', order);
    return orderSchema.parse(response.data);
  }

  static async cancelOrder(id: Order['id']): Promise<Order> {
    const response = await axiosInstance.patch(`/customer/orders/${id.toString()}/cancel`);
    return orderSchema.parse(response.data);
  }

  static async updateCustomerComment(id: Order['id'], customerComment: string): Promise<Order> {
    const response = await axiosInstance.patch(`/customer/orders/${id.toString()}/customerComment`, {
      customerComment,
    });
    return orderSchema.parse(response.data);
  }
}

export default OrderService;
