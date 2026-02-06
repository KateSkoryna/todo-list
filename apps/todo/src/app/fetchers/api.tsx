import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTodoListFetcher,
  deleteTodoListFetcher,
  createTodoFetcher,
  updateTodoFetcher,
  deleteTodoFetcher,
} from './todolist';
import {
  TodoList as TodoListType,
  TodoItem as TodoItemType,
} from '@fyltura/types';

export const useCreateListMutation = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation<TodoListType, Error, string>({
    mutationFn: (name) => createTodoListFetcher(name, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists', userId] });
    },
    onError: (err) => {
      console.error('Error creating todolist:', err);
    },
  });
};

export const useDeleteListMutation = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteTodoListFetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists', userId] });
    },
    onError: (err) => {
      console.error('Error deleting todolist:', err);
    },
  });
};

export const useAddTodoMutation = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation<TodoItemType, Error, { todolistId: string; name: string }>(
    {
      mutationFn: ({ todolistId, name }) => createTodoFetcher(todolistId, name),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todoLists', userId] });
      },
      onError: (err) => {
        console.error('Error creating todo:', err);
      },
    }
  );
};

export const useToggleTodoMutation = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation<TodoItemType, Error, { id: string; isDone: boolean }>({
    mutationFn: ({ id, isDone }) => updateTodoFetcher(id, isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists', userId] });
    },
    onError: (err) => {
      console.error('Error updating todo:', err);
    },
  });
};

export const useDeleteTodoMutation = (userId: number) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteTodoFetcher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists', userId] });
    },
    onError: (err) => {
      console.error('Error deleting todo:', err);
    },
  });
};
