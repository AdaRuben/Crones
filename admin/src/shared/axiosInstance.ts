import type { AxiosError } from 'axios';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
});

let accessToken = '';

export function setAccessToken(token: string): void {
  accessToken = token;
}

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization ??= `Bearer ${accessToken}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err: AxiosError & { config?: { sent?: boolean } }) => {
    const prev = err.config;

    if (!prev) return Promise.reject(err);

    if (err.response?.status === 403 && !prev.sent) {
      prev.sent = true;
      const response = await axios.get<{ accessToken: string }>('/api/auth/refresh');
      const newToken = response.data.accessToken;
      setAccessToken(newToken);
      prev.headers = { ...(prev.headers ?? {}), Authorization: `Bearer ${newToken}` };
      return axiosInstance(prev);
    }

    return Promise.reject(err);
  },
);

export default axiosInstance;