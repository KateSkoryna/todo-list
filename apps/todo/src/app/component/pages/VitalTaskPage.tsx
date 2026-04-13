import { useTodoListsData } from '../../hooks/useTodoListsData';
import TodoLists from '../todo/TodoLists';

function VitalTaskPage() {
  const {
    todoLists,
    isLoading,
    isError,
    error,
    refetch,
    handleDeleteList,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleEditTodo,
  } = useTodoListsData();

  const vitalLists = todoLists?.filter((l) => l.priority === 'high');

  return (
    <div className="space-y-4">
      <p className="text-secondary-dark-bg text-sm">
        Showing high-priority task lists.
      </p>
      <TodoLists
        todoLists={vitalLists}
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
    </div>
  );
}

export default VitalTaskPage;
