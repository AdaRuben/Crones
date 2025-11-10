import { createSlice } from "@reduxjs/toolkit";
import type { Order } from "./type";
import { editOrder, fetchOrders } from "./thunks";


export type OrderState = {
    orders: Order[];
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // sortOrders: (state, action: PayloadAction<'asc' | 'desc'>) => {
    //   state.orders.sort((a, b) => {
    //    // Написать логику сортировки по статусу заказа
    //   });
    // },
  },
    extraReducers(builder) {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error = action.error.message ?? 'Странная ошибка';
      });
      builder.addCase(editOrder.pending, (state) => {
        state.error = null;
      })
      .addCase(editOrder.fulfilled, (state, action) => {
        state.orders.map((order) => {
        if (order.id === action.payload.id) {
          return state.orders;
        }
        return order;
      });
      state.error = null;
      })
      .addCase(editOrder.rejected, (state, action) => {
        state.error = action.error.message ?? 'Странная ошибка';
      })
},
  },
  
);

// export const { sortOrders } = orderSlice.actions;

export default orderSlice.reducer;