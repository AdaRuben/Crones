import { configureStore } from '@reduxjs/toolkit';
import mapReducer from '../../entities/maps/slice/MapSlices';
import authReducer from '../../entities/regs/slice/slice';

export const store = configureStore({
  reducer: {
    map: mapReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
