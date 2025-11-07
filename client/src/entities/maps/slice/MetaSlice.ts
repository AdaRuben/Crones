import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type MapMetaState = {
  ymaps: typeof window.ymaps | null;
};

const initialState: MapMetaState = {
  ymaps: null,
};

const mapMetaSlice = createSlice({
  name: 'mapMeta',
  initialState,
  reducers: {
    setYmaps(state, action: PayloadAction<typeof window.ymaps>) {
      state.ymaps = action.payload;
    },
  },
});

export const { setYmaps } = mapMetaSlice.actions;
export default mapMetaSlice.reducer;
