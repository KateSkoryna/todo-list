import { useState } from 'react';
import TodoList from './TodoList';
import Text from '../elements/Text';
import Loader from '../elements/Loader';
import ErrorFallback from '../elements/ErrorFallback';
import Container from '../elements/Container';
import { TodoList as TodoListType, UpdateTodoItem } from '@shared/types';
import {
  SortKey,
  SORT_OPTIONS,
  PRIORITY_ORDER,
} from '../../constants/todolist.constants';

type NewTodoOpts = {
  dueDate?: string;
  location?: string;
  notes?: string;
};

interface TodoListsProps {
  todoLists: TodoListType[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  handleDeleteList: (id: string) => void;
  handleAddTodo: (todolistId: string, name: string, opts?: NewTodoOpts) => void;
  handleToggleTodo: (id: string, todolistId: string) => void;
  handleDeleteTodo: (id: string, todolistId: string) => void;
  handleEditTodo: (
    id: string,
    todolistId: string,
    updates: UpdateTodoItem
  ) => void;
}

function sortLists(lists: TodoListType[], key: SortKey): TodoListType[] {
  return [...lists].sort((a, b) => {
    switch (key) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'priority': {
        const pa = a.priority ? PRIORITY_ORDER[a.priority] ?? 3 : 3;
        const pb = b.priority ? PRIORITY_ORDER[b.priority] ?? 3 : 3;
        return pa - pb;
      }
      case 'dueDate': {
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return da - db;
      }
      case 'category':
        return (a.category ?? '').localeCompare(b.category ?? '');
      default:
        return 0;
    }
  });
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
  const [sortKey, setSortKey] = useState<SortKey>('name');

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

  const sorted = todoLists ? sortLists(todoLists, sortKey) : [];

  return (
    <Container className="space-y-6">
      {todoLists && todoLists.length > 0 && (
        <div className="flex items-center gap-3">
          <Text as="span" className="text-sm font-medium text-dark-bg">
            Sort by:
          </Text>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortKey(opt.value)}
              className={`w-24 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-triadic-orange border ${
                sortKey === opt.value
                  ? 'bg-triadic-orange text-white border-triadic-orange'
                  : 'bg-secondary-bg text-dark-bg border-secondary-bg hover:bg-triadic-orange hover:text-white hover:border-triadic-orange'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {sorted.length === 0 ? (
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
          {sorted.map((list) => (
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
