import { createAsyncThunk } from "@reduxjs/toolkit";
import UserService from "../api/UserService";
import type { loginUser, newUser } from "./type";
import { setAccessToken } from "@/shared/axiosInstance";



export const registerUser = createAsyncThunk('user/registerUser', async (user: newUser) => {
    const regUser = await UserService.registerUser(user);
    return regUser;
})

export const refreshThunk = createAsyncThunk('user/refresh', async () => {
  const response = await UserService.refresh();
  setAccessToken(response.accessToken);
  return response.admin;
});

export const loginUsers = createAsyncThunk('user/loginUser', async (user: loginUser) => {
    const logUser = await UserService.loginUser(user);
    return logUser;
})

export const logoutThunk = createAsyncThunk('user/logout', async () => {
    await UserService.logout();
})
