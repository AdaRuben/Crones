import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  mapStateSchema,
  type MapState,
  type RouteInfo,
  type Suggestion,
  type ActivePoint,
  type Point,
} from '../types/MapTypes';
import { fetchGeocode, fetchSuggestions } from '../thunks/MapThunks';

const initialState: MapState = mapStateSchema.parse({
  activePoint: 'from',
  from: { address: '', coords: null },
  to: { address: '', coords: null },
  routeInfo: null,
  suggestions: [],
  suggestVisible: false,
  sheetExpanded: false,
});

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setActivePoint(state, action: PayloadAction<ActivePoint>) {
      state.activePoint = action.payload;
    },
    setPoint(state, action: PayloadAction<{ type: ActivePoint; point: Point }>) {
      const { type, point } = action.payload;
      state[type] = point;
    },
    toggleSheet(state) {
      state.sheetExpanded = !state.sheetExpanded;
    },
    swapPoints(state) {
      const next = state.to;
      state.to = state.from;
      state.from = next;
    },
    clearRoute(state) {
      state.from = { address: '', coords: null };
      state.to = { address: '', coords: null };
      state.routeInfo = null;
      state.activePoint = 'from';
      state.suggestions = [];
      state.suggestVisible = false;
    },
    setRouteInfo(state, action: PayloadAction<RouteInfo>) {
      state.routeInfo = action.payload;
    },
    hideSuggestions(state) {
      state.suggestVisible = false;
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.suggestVisible = true;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action: PayloadAction<Suggestion[]>) => {
        state.suggestions = action.payload;
        state.suggestVisible = action.payload.length > 0;
      })
      .addCase(fetchSuggestions.rejected, (state) => {
        state.suggestions = [];
        state.suggestVisible = false;
      })
      .addCase(
        fetchGeocode.fulfilled,
        (
          state,
          action: PayloadAction<{
            type: ActivePoint;
            point: Point;
            switchTo: ActivePoint;
          }>,
        ) => {
          const { type, point, switchTo } = action.payload;
          state[type] = point;
          state.activePoint = switchTo;
          state.suggestions = [];
          state.suggestVisible = false;
        },
      );
  },
});

export const {
  setActivePoint,
  setPoint,
  toggleSheet,
  swapPoints,
  clearRoute,
  setRouteInfo,
  hideSuggestions,
} = mapSlice.actions;

export default mapSlice.reducer;