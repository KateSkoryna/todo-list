import { AuthResponse, LoginRequest, RegisterRequest } from '@shared/types';
import apiClient from '../lib/apiClient';

export const loginFetcher = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const body: LoginRequest = { email, password };
  const { data } = await apiClient.post<AuthResponse>('/auth/login', body);
  return data;
};

export const registerFetcher = async (
  email: string,
  password: string,
  displayName: string
): Promise<AuthResponse> => {
  const body: RegisterRequest = { email, password, displayName };
  const { data } = await apiClient.post<AuthResponse>('/auth/register', body);
  return data;
};
