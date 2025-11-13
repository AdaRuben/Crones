import { createAsyncThunk } from '@reduxjs/toolkit';
import OrderService from '../api/OrderService';
import type { newOrder } from './type';

export const fetchOrders = createAsyncThunk('order/fetchOrders', async () => {
  const orders = await OrderService.getOrders();
  const ordersDate = orders.map((order) => ({
    ...order,
    createdAt: new Date(order.createdAt).toISOString(),
  }));
  return ordersDate;
});

export const editOrder = createAsyncThunk(
  'order/editOrder',
  async ({ id, order }: { id: number; order: newOrder }) => {
    const apdateOrder = await OrderService.editOrder(id, order);
    return apdateOrder;
  },
);
