import { useTodoListsData } from '../../hooks/useTodoListsData';
import TodoListForm from './TodoListForm';
import TodoLists from './TodoLists';

type TodoContainerProps = {
  userId: number;
};

const TodoContainer: React.FC<TodoContainerProps> = ({
  userId,
}: {
  userId: number;
}) => {
  const {
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
    createListMutationIsPending,
  } = useTodoListsData(userId);
  return (
    <>
      <TodoListForm
        onSubmit={handleCreateList}
        isSubmitting={createListMutationIsPending}
      />
      <TodoLists
        todoLists={todoLists}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        handleDeleteList={handleDeleteList}
        handleAddTodo={handleAddTodo}
        handleToggleTodo={handleToggleTodo}
        handleDeleteTodo={handleDeleteTodo}
        handleEditTodo={handleEditTodo}
      />
    </>
  );
};

export default TodoContainer;
