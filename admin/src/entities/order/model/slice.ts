import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Order } from "./type";
import { editOrder, fetchOrders } from "./thunks";


export type OrderState = {
    orders: Order[];
    error: string | null;
    status: string | null;
}

const initialState: OrderState = {
    orders: [],
    error: null,
    status: "new",
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setStatus: (
      state,
      action: PayloadAction<{ id: Order['id']; status: Order['status'] }>
    ) => {
      const order = state.orders.find(({ id }) => id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
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
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(editOrder.rejected, (state, action) => {
        state.error = action.error.message ?? 'Странная ошибка';
      });
},
  },
  
);

export const { setStatus } = orderSlice.actions;

export default orderSlice.reducer;