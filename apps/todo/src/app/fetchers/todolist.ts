import {
  TodoList as TodoListType,
  TodoItem as TodoItemType,
} from '@fyltura/types';

const API_BASE = 'http://localhost:3333/api';

// Fetch all todolists
export const getTodoListsFetcher = async (
  userId: number
): Promise<TodoListType[]> => {
  const response = await fetch(`${API_BASE}/todolists?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch todolists');
  }
  return response.json();
};

// Create new todolist
export const createTodoListFetcher = async (
  name: string,
  userId: number
): Promise<TodoListType> => {
  const response = await fetch(`${API_BASE}/todolists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, userId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create todolist');
  }
  return response.json();
};

// Delete todolist
export const deleteTodoListFetcher = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/todolists/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete todolist');
  }
};

// Add todo to list
export const createTodoFetcher = async (
  todolistId: string,
  name: string
): Promise<TodoItemType> => {
  const response = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, isDone: false, todolistId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  return response.json();
};

// Toggle todo completion
export const updateTodoFetcher = async (
  id: string,
  isDone: boolean
): Promise<TodoItemType> => {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isDone }),
  });
  if (!response.ok) {
    throw new Error('Failed to update todo');
  }
  return response.json();
};

// Delete todo
export const deleteTodoFetcher = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};
