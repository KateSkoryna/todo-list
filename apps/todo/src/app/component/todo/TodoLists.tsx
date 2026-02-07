import TodoList from './TodoList';
import Text from '../elements/Text';
import Loader from '../elements/Loader';
import ErrorFallback from '../elements/ErrorFallback';
import Container from '../elements/Container';
import { TodoList as TodoListType } from '@fyltura/types';

interface TodoListsProps {
  todoLists: TodoListType[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  handleDeleteList: (id: string) => void;
  handleAddTodo: (todolistId: string, name: string) => void;
  handleToggleTodo: (id: string) => void;
  handleDeleteTodo: (id: string) => void;
  handleEditTodo: (id: string, newName: string) => void;
}

function TodoLists({
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
}: TodoListsProps) {
  if (isLoading) {
    return <Loader message="Loading todo lists..." />;
  }

  if (isError) {
    return (
      <ErrorFallback
        error={error as Error}
        resetErrorBoundary={() => refetch()}
        className="max-w-md mx-auto"
      />
    );
  }

  return (
    <Container className="space-y-6">
      {todoLists?.length === 0 ? (
        <Container className="bg-white rounded-lg shadow-lg p-12 text-center border-2 border-secondary-bg">
          <Text
            as="p"
            className="text-xl text-dark-bg"
            dataTestId="empty-todolists-message"
          >
            No todo lists yet. Create one above to get started!
          </Text>
        </Container>
      ) : (
        <Container className="space-y-6">
          {todoLists?.map((list) => (
            <TodoList
              key={list.id}
              todoList={list}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              onDeleteList={handleDeleteList}
              onEditTodo={handleEditTodo}
              dataTestId={'todolist-item-' + list.id}
            />
          ))}
        </Container>
      )}
    </Container>
  );
}

export default TodoLists;
