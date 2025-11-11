import { createSlice } from '@reduxjs/toolkit';
import type { Order } from '../types/types';
import {
  fetchAllOrders,
  fetchOrderById,
  createOrder,
  cancelOrder,
  updateCustomerComment,
} from './thunks';

type OrdersState = {
  orders: Order[];
  currentOrder: Order | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  status: 'idle',
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAllOrders
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });

    // fetchOrderById
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });

    // createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });

    // cancelOrder
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });

    // updateCustomerComment
    builder
      .addCase(updateCustomerComment.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCustomerComment.fulfilled, (state, action) => {
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
        state.status = 'succeeded';
      })
      .addCase(updateCustomerComment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const { clearCurrentOrder, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
