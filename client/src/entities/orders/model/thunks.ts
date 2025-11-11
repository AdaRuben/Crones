import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import OrderService from '../api/orderService';
import type { NewOrder, Order } from '../types/types';

// >;CG5=85 2A5E 70:07>2
export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async () => {
  try {
    const orders = await OrderService.fetchAllOrders();
    return orders;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    } else if (error instanceof Error) {
      throw new Error(error.message || 'H81:0 ?@8 703@C7:5 70:07>2', { cause: error });
    }
    throw error;
  }
});

// >;CG5=85 70:070 ?> ID
export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id: number) => {
  try {
    const order = await OrderService.fetchOrderById(id);
    return order;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    } else if (error instanceof Error) {
      throw new Error(error.message || 'H81:0 ?@8 703@C7:5 70:070', { cause: error });
    }
    throw error;
  }
});

// !>740=85 =>2>3> 70:070
export const createOrder = createAsyncThunk('orders/create', async (order: NewOrder) => {
  try {
    const newOrder = await OrderService.createOrder(order);
    return newOrder;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    } else if (error instanceof Error) {
      throw new Error(error.message || 'H81:0 ?@8 A>740=88 70:070', { cause: error });
    }
    throw error;
  }
});

// B<5=0 70:070
export const cancelOrder = createAsyncThunk('orders/cancel', async (id: Order['id']) => {
  try {
    const cancelledOrder = await OrderService.cancelOrder(id);
    return cancelledOrder;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    } else if (error instanceof Error) {
      throw new Error(error.message || 'H81:0 ?@8 >B<5=5 70:070', { cause: error });
    }
    throw error;
  }
});

// 1=>2;5=85 :><<5=B0@8O :;85=B0
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
        throw new Error(error.message || 'H81:0 ?@8 >1=>2;5=88 :><<5=B0@8O', { cause: error });
      }
      throw error;
    }
  },
);
