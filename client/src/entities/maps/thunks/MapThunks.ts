import { createAsyncThunk } from '@reduxjs/toolkit';
import { geocode, suggest } from '../api/MapApi';
import type { ActivePoint, Point, Suggestion } from '../types/MapTypes';
export const fetchSuggestions = createAsyncThunk<
  Suggestion[],
  { query: string; ymaps: typeof ymaps },
  { rejectValue: string }
>('map/fetchSuggestions', async ({ query, ymaps }, { rejectWithValue }) => {
  try {
    return await suggest(ymaps, query);
  } catch (error) {
    console.error('Suggest error', error);
    return rejectWithValue('suggest failed');
  }
});
export const fetchGeocode = createAsyncThunk<
  { type: ActivePoint; point: Point; switchTo: ActivePoint },
  { query: string; type: ActivePoint; ymaps: typeof ymaps },
  { rejectValue: string }
>('map/fetchGeocode', async ({ query, type, ymaps }, { rejectWithValue }) => {
  try {
    const result = await geocode(ymaps, query);
    if (!result) return rejectWithValue('not found');
    return {
      type,
      point: { address: result.address, coords: result.coords },
      switchTo: type === 'from' ? 'to' : 'from',
    };
  } catch (error) {
    console.error('Geocode error', error);
    return rejectWithValue('geocode failed');
  }
});
