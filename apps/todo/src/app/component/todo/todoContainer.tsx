import { useTodoListsData } from '../../hooks/useTodoListsData';
import TodoListForm from './TodoListForm';
import TodoLists from './TodoLists';
import { TodoListPriority, TodoListCategory } from '@shared/types';

type CreateListOpts = {
  priority?: TodoListPriority;
  category?: TodoListCategory;
  dueDate?: string | null;
  notes?: string | null;
};

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
        onSubmit={(name, opts?: CreateListOpts) => handleCreateList(name, opts)}
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
