import { useState } from 'react';
import TodoList from './TodoList';
import Text from '../elements/Text';
import Loader from '../elements/Loader';
import ErrorFallback from '../elements/ErrorFallback';
import Container from '../elements/Container';
import { TodoList as TodoListType, UpdateTodoItem } from '@shared/types';

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

type SortKey = 'name' | 'priority' | 'dueDate' | 'category';

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

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

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'priority', label: 'Priority' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'category', label: 'Category' },
];

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
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                sortKey === opt.value
                  ? 'bg-accent text-black'
                  : 'bg-secondary-bg text-dark-bg hover:bg-accent hover:text-black'
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
