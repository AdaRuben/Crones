import { createAsyncThunk } from '@reduxjs/toolkit';
import OrderService from '../api/orderService';
import type { NewOrder, Order } from '../types/types';

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async () => {
  const orders = await OrderService.fetchAllOrders();
  return orders;
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id: number) => {
  const order = await OrderService.fetchOrderById(id);
  return order;
});

export const createOrder = createAsyncThunk('orders/create', async (order: NewOrder) => {
  const newOrder = await OrderService.createOrder(order);
  return newOrder;
});

export const cancelOrder = createAsyncThunk('orders/cancel', async (id: Order['id']) => {
  const cancelledOrder = await OrderService.cancelOrder(id);
  return cancelledOrder;
});

export const updateCustomerComment = createAsyncThunk(
  'orders/updateCustomerComment',
  async ({ id, customerComment }: { id: Order['id']; customerComment: string }) => {
    const updatedOrder = await OrderService.updateCustomerComment(id, customerComment);
    return updatedOrder;
  },
);
