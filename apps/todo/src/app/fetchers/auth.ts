import { User } from '@shared/types';
import apiClient from '../lib/apiClient';

export const provisionUserFetcher = async (
  firstName: string,
  lastName: string,
  username: string
): Promise<User> => {
  const { data } = await apiClient.post<User>('/auth/provision', {
    firstName,
    lastName,
    username,
  });
  return data;
};
