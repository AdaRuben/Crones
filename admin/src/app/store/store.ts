import { configureStore } from '@reduxjs/toolkit';
import orderReducer from '@/entities/order/model/slice'
import userReducer from '@/entities/user/model/slice'

export const store = configureStore({
  reducer: {
    order: orderReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;