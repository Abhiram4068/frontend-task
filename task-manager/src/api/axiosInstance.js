import axios from 'axios';
import { store } from '../app/store';
import { logout, setCredentials } from '../features/auth/authSlice';

const BASE_URL = 'http://localhost:8000/api'; // change to your backend URL

const axiosInstance = axios.create({ baseURL: BASE_URL });

// Attach access token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 → try refresh; on failure → logout
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        const newAccessToken = data?.access || data?.tokens?.access;
        if (!newAccessToken) throw new Error('No access token in refresh response');
        localStorage.setItem('accessToken', newAccessToken);
        store.dispatch(setCredentials({ accessToken: newAccessToken }));
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(original);
      } catch {
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;