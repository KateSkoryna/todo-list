import {
  TodoList as TodoListType,
  TodoItem as TodoItemType,
} from '@fyltura/types';
import apiClient from '../lib/apiClient';

export const getTodoListsFetcher = async (
  userId: string
): Promise<TodoListType[]> => {
  const { data } = await apiClient.get(`/users/${userId}/todolists`);
  return data;
};

export const createTodoListFetcher = async (
  name: string,
  userId: string
): Promise<TodoListType> => {
  const { data } = await apiClient.post(`/users/${userId}/todolists`, { name });
  return data;
};

export const deleteTodoListFetcher = async (
  todolistId: string,
  userId: string
): Promise<void> => {
  await apiClient.delete(`/users/${userId}/todolists/${todolistId}`);
};

export const createTodoFetcher = async (
  todolistId: string,
  userId: string,
  name: string,
  opts?: { dueDate?: string; location?: string; notes?: string }
): Promise<TodoItemType> => {
  const { data } = await apiClient.post(
    `/users/${userId}/todolists/${todolistId}/todos`,
    { name, ...opts }
  );
  return data;
};

export const updateTodoFetcher = async (
  id: string,
  todolistId: string,
  userId: string,
  updates: {
    name?: string;
    status?: string;
    dueDate?: string | null;
    location?: string | null;
    notes?: string | null;
  }
): Promise<TodoItemType> => {
  const { data } = await apiClient.put(
    `/users/${userId}/todolists/${todolistId}/todos/${id}`,
    updates
  );
  return data;
};

export const deleteTodoFetcher = async (
  id: string,
  todolistId: string,
  userId: string
): Promise<void> => {
  await apiClient.delete(
    `/users/${userId}/todolists/${todolistId}/todos/${id}`
  );
};
