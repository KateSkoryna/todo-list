import {
  useCreateListMutation,
  useDeleteListMutation,
  useAddTodoMutation,
  useToggleTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
  useTodoListsQuery,
} from '../fetchers/api';
import { UpdateTodoItem } from '@fyltura/types';

export const useTodoListsData = () => {
  const {
    data: todoLists,
    isLoading,
    isError,
    error,
    refetch,
  } = useTodoListsQuery();

  const createListMutation = useCreateListMutation();
  const deleteListMutation = useDeleteListMutation();
  const addTodoMutation = useAddTodoMutation();
  const toggleTodoMutation = useToggleTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();
  const editTodoMutation = useEditTodoMutation();

  const handleCreateList = (name: string) => {
    createListMutation.mutate(name);
  };

  const handleDeleteList = (id: string) => {
    deleteListMutation.mutate(id);
  };

  const handleAddTodo = (
    todolistId: string,
    name: string,
    opts?: { dueDate?: string; location?: string; notes?: string }
  ) => {
    addTodoMutation.mutate({ todolistId, name, ...opts });
  };

  const handleToggleTodo = (id: string, todolistId: string) => {
    const todo = todoLists
      ?.flatMap((list) => list.todos)
      .find((t) => t.id === id);
    if (todo) {
      toggleTodoMutation.mutate({
        id,
        todolistId,
        status: todo.status === 'successful' ? 'pending' : 'successful',
      });
    }
  };

  const handleDeleteTodo = (id: string, todolistId: string) => {
    deleteTodoMutation.mutate({ id, todolistId });
  };

  const handleEditTodo = (
    id: string,
    todolistId: string,
    updates: UpdateTodoItem
  ) => {
    editTodoMutation.mutate({ id, todolistId, ...updates });
  };

  return {
    todoLists,
    isLoading,
    isError,
    error,
    refetch,
    handleCreateList,
    handleDeleteList,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleEditTodo,
    createListMutationIsPending: createListMutation.isPending,
  };
};
