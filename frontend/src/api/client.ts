import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API] Token attached to ${config.method?.toUpperCase()} ${config.url}`);
  } else {
    console.warn(`[API] No token found for ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});
