import { useTodoListsData } from '../../hooks/useTodoListsData';
import TodoListForm from './TodoListForm';
import TodoLists from './TodoLists';

const TodoContainer: React.FC = () => {
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
  } = useTodoListsData();
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
