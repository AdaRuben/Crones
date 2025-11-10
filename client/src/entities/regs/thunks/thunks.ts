import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../api/api';
import { type UserLogin, type UserRegister } from '../types/types';
import { AxiosError } from 'axios';

export const signIn = createAsyncThunk('user/signIn', async (data: UserLogin) => {
  try {
    const user = await userService.signIn(data);
    return user;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    } else if (error instanceof Error) {
      throw new Error(error.message || 'Неизвестная ошибка', { cause: error });
    }
    throw error;
  }
});

export const signUp = createAsyncThunk('user/signUp', async (data: UserRegister) => {
  const user = await userService.signUp(data);
  return user;
});

export const signOut = createAsyncThunk('user/signOut', async () => {
  await userService.signOut();
});

export const refresh = createAsyncThunk('user/refresh', async () => {
  const user = await userService.refresh();
  return user;
});