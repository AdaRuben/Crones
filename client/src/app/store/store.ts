import { configureStore } from '@reduxjs/toolkit';
import mapReducer from '../../entities/maps/slice/MapSlices';
// import mapMetaReducer from '../../entities/maps/slice/MetaSlice';

export const store = configureStore({
  reducer: {
    map: mapReducer,
    // mapMeta: mapMetaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;