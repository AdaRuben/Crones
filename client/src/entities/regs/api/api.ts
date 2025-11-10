import axiosInstance from '../../../shared/axiosInstance';
import type { UserLogin, UserResponse } from '../types/types';
import { UserResponseSchema, type UserRegister } from '../types/types';

export const userService = {
  async signUp(formData: UserRegister) {
    try {
      const response = await axiosInstance.post('/auth/signup', formData);
      const validateData = UserResponseSchema.parse(response.data);
      return validateData;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw error;
    }
  },

  async signIn(formData: UserLogin) {
    try {
      const response = await axiosInstance.post('/auth/signin', formData);
      const validateData = UserResponseSchema.parse(response.data);
      return validateData;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw error;
    }
  },

  async signOut(): Promise<void> {
    try {
      await axiosInstance.delete('/auth/signout');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw error;
    }
  },

  async refresh(): Promise<UserResponse> {
    try {
      const response = await axiosInstance.get('/auth/refresh');
      const validateData = UserResponseSchema.parse(response.data);
      return validateData;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      throw error;
    }
  },
};

export default userService;
