import { configureStore } from '@reduxjs/toolkit';
import mapReducer from '../../entities/maps/slice/MapSlices';
import authReducer from '../../entities/regs/slice/slice';
import ordersReducer from '../../entities/orders/model/slice';

export const store = configureStore({
  reducer: {
    map: mapReducer,
    auth: authReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
