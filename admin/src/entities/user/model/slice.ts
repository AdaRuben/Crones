import { createSlice } from "@reduxjs/toolkit";
import type { UserWithoutPassword } from "./type";
import { loginUsers, logoutThunk, registerUser } from "./thunks";


export type UserState = {
  users: UserWithoutPassword[];
    error: string | null;
    isLogin: boolean;
}

const initialState: UserState = {
    users: [],
    error: null,
    isLogin: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
    extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state) => {
        state.error = null;
        state.isLogin = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.users.push(action.payload.admin);
        state.error = null;
        state.isLogin = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Странная ошибка';
        state.isLogin = false;
      });
      builder
      .addCase(loginUsers.pending, (state) => {
        state.error = null;
        state.isLogin = false;
      })
      .addCase(loginUsers.fulfilled, (state, action) => {
        state.users.push(action.payload.admin);
        state.error = null;
        state.isLogin = true;
      })
      .addCase(loginUsers.rejected, (state, action) => {
        state.error = action.error.message ?? 'Странная ошибка';
        state.isLogin = false;
      });
      builder.addCase(logoutThunk.fulfilled, (state) => {
      state.users = [];
      state.isLogin = false;
      });
    }})

    export default userSlice.reducer;