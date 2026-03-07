import { apiClient } from '../../api/client';

export const login = async (data: URLSearchParams) => {
  const response = await apiClient.post('/auth/login', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};
