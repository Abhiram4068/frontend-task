import axios from 'axios';
import store from '../store';
import router from '../router';

const api = axios.create({
  baseURL: '/api/',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(config => {
  const token = store.state.auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Check if error is 401, not a retry, and we are not trying to refresh token
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== 'auth/refresh/') {
      originalRequest._retry = true;
      try {
        await store.dispatch('auth/refreshToken');
        const token = store.state.auth.accessToken;
        
        // Update both default and original request headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        await store.dispatch('auth/clearTokensLocally');
        router.push('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
