import { useQuery } from '@tanstack/react-query';
import { TodoList as TodoListType } from '@fyltura/types';
import { getTodoListsFetcher } from '../fetchers/todolist';
import {
  useCreateListMutation,
  useDeleteListMutation,
  useAddTodoMutation,
  useToggleTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
} from '../fetchers/api';

const USER_ID = 1;

export const useTodoListsData = () => {
  const {
    data: todoLists,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<TodoListType[], Error>({
    queryKey: ['todoLists', USER_ID],
    queryFn: () => getTodoListsFetcher(USER_ID),
  });

  const createListMutation = useCreateListMutation(USER_ID);
  const deleteListMutation = useDeleteListMutation(USER_ID);
  const addTodoMutation = useAddTodoMutation(USER_ID);
  const toggleTodoMutation = useToggleTodoMutation(USER_ID);
  const deleteTodoMutation = useDeleteTodoMutation(USER_ID);
  const editTodoMutation = useEditTodoMutation(USER_ID);

  const handleCreateList = (name: string) => {
    createListMutation.mutate(name);
  };

  const handleDeleteList = (id: string) => {
    deleteListMutation.mutate(id);
  };

  const handleAddTodo = (todolistId: string, name: string) => {
    addTodoMutation.mutate({ todolistId, name });
  };

  const handleToggleTodo = (id: string) => {
    const todo = todoLists
      ?.flatMap((list) => list.todos)
      .find((t) => t.id === id);
    if (todo) {
      toggleTodoMutation.mutate({ id, isDone: !todo.isDone });
    }
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodoMutation.mutate(id);
  };

  const handleEditTodo = (id: string, name: string) => {
    editTodoMutation.mutate({ id, name });
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
