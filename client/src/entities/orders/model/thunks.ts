import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import OrderService from '../api/orderService';
import type { NewOrder, Order } from '../types/types';

export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async () => {
  try {
    const orders = await OrderService.fetchAllOrders();
    return orders;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
});


export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id: number) => {
  try {
    const order = await OrderService.fetchOrderById(id);
    return order;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
});

export const createOrder = createAsyncThunk('orders/create', async (order: NewOrder) => {
  try {
    const newOrder = await OrderService.createOrder(order);
    return newOrder;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
});


export const cancelOrder = createAsyncThunk('orders/cancel', async (id: Order['id']) => {
  try {
    const cancelledOrder = await OrderService.cancelOrder(id);
    return cancelledOrder;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw error;
  }
});

export const updateCustomerComment = createAsyncThunk(
  'orders/updateCustomerComment',
  async ({ id, customerComment }: { id: Order['id']; customerComment: string }) => {
    try {
      const updatedOrder = await OrderService.updateCustomerComment(id, customerComment);
      return updatedOrder;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data;
      } else if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  },
);
