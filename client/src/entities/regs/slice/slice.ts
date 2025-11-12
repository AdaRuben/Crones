import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../types/types';
import { refresh, signIn, signOut, signUp } from '../thunks/thunks';
import { setAccessToken } from '@/shared/axiosInstance';

type UserState = {
  user: User | null;
  status: 'loading' | 'logged' | 'guest';
  error: string | null;
};

const initialState: UserState = {
  user: null,
  status: 'loading',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.status = 'logged';
        state.error = null;
        setAccessToken(payload.accessToken);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'guest';
        state.user = null;
        state.error = action.error.message ?? 'Ошибка при входе';
      });

    builder
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.status = 'logged';
        state.error = null;
        setAccessToken(payload.accessToken);
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'guest';
        state.user = null;
        state.error = action.error.message ?? 'Ошибка при регистрации';
      });

    builder
      .addCase(signOut.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.status = 'guest';
        state.error = null;
        setAccessToken('');
      })
      .addCase(signOut.rejected, (state, action) => {
        state.status = 'logged';
        state.error = action.error.message ?? 'Ошибка при выходе';
      });

    builder
      .addCase(refresh.pending, (state) => {
        state.status = 'loading';
        state.user = null;
        state.error = null;
      })
      .addCase(refresh.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.status = 'logged';
        state.error = null;
        setAccessToken(payload.accessToken);
      })
      .addCase(refresh.rejected, (state, action) => {
        state.status = 'guest';
        state.user = null;
        state.error = action.error.message ?? 'Ошибка при обновлении';
        setAccessToken('');
      });
  },
});

export default userSlice.reducer;
