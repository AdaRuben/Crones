import axiosInstance, { setAccessToken } from '@/shared/axiosInstance';
import { authResponseSchema } from '../model/schema';
import type { loginUser, newUser, User } from '../model/type';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class UserService {
  static async registerUser(user: newUser): Promise<{ admin: Omit<User, 'password'> }> {
    try {
      const res = await axiosInstance.post('/admin/signup', user);
      const parsed = authResponseSchema.parse(res.data);
      setAccessToken(parsed.accessToken);
      return parsed;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw error;
    }
  }

  static async refresh(): Promise<{ admin: Omit<User, 'password'>; accessToken: string }> {
    try {
      const res = await axiosInstance.get('/admin/refresh');
      const parsed = authResponseSchema.parse(res.data);
      setAccessToken(parsed.accessToken);
      return parsed;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw error;
    }
  }

  static async loginUser(user: loginUser): Promise<loginUser> {
    try {
      const res = await axiosInstance.post('/admin/signin', user);
      const parsed = authResponseSchema.parse(res.data);
      setAccessToken(parsed.accessToken);
      return parsed;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      await axiosInstance.delete('/admin/signout');
      setAccessToken('');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      throw error;
    }
  }
}

export default UserService;