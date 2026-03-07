import { apiClient } from '../../api/client';

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

export const updateMe = async (data: { email?: string; full_name?: string; password?: string }): Promise<User> => {
  const response = await apiClient.patch('/users/me', data);
  return response.data;
};
