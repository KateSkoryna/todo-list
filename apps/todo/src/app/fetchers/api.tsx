import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTodoListFetcher,
  deleteTodoListFetcher,
  createTodoFetcher,
  updateTodoFetcher,
  deleteTodoFetcher,
  getTodoListsFetcher,
} from './todolist';
import {
  TodoList as TodoListType,
  TodoItem as TodoItemType,
} from '@fyltura/types';
import { useAuthStore } from '../store/authStore';

export const useTodoListsQuery = () => {
  const user = useAuthStore((s) => s.user);
  return useQuery<TodoListType[], Error>({
    queryKey: ['todoLists', user?.id],
    queryFn: () => getTodoListsFetcher(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useCreateListMutation = () => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  return useMutation<TodoListType, Error, string>({
    mutationFn: (name) => createTodoListFetcher(name, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists', user?.id] });
    },
    onError: (err) => console.error('Error creating todolist:', err),
  });
};

export const useDeleteListMutation = () => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (todolistId) => deleteTodoListFetcher(todolistId, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists', user?.id] });
    },
    onError: (err) => console.error('Error deleting todolist:', err),
  });
};

export const useAddTodoMutation = () => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  return useMutation<TodoItemType, Error, { todolistId: string; name: string }>(
    {
      mutationFn: ({ todolistId, name }) =>
        createTodoFetcher(todolistId, user!.id, name),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todoLists', user?.id] });
      },
      onError: (err) => console.error('Error creating todo:', err),
    }
  );
};

export const useToggleTodoMutation = () => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  return useMutation<
    TodoItemType,
    Error,
    { id: string; todolistId: string; status: string }
  >({
    mutationFn: ({ id, todolistId, status }) =>
      updateTodoFetcher(id, todolistId, user!.id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists', user?.id] });
    },
    onError: (err) => console.error('Error updating todo:', err),
  });
};

export const useEditTodoMutation = () => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  return useMutation<
    TodoItemType,
    Error,
    { id: string; todolistId: string; name: string }
  >({
    mutationFn: ({ id, todolistId, name }) =>
      updateTodoFetcher(id, todolistId, user!.id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists', user?.id] });
    },
    onError: (err) => console.error('Error editing todo:', err),
  });
};

export const useDeleteTodoMutation = () => {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; todolistId: string }>({
    mutationFn: ({ id, todolistId }) =>
      deleteTodoFetcher(id, todolistId, user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoLists', user?.id] });
    },
    onError: (err) => console.error('Error deleting todo:', err),
  });
};
