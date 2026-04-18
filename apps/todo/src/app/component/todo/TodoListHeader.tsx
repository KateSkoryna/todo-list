import React from 'react';
import { TodoList as TodoListType } from '@shared/types';
import Button from '../elements/Button';
import Text from '../elements/Text';
import {
  PRIORITY_COLORS,
  CATEGORY_LABELS,
} from '../../constants/todolist.constants';

interface TodoListHeaderProps {
  todoList: TodoListType;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onDeleteList: (id: string) => void;
}

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const TodoListHeader: React.FC<TodoListHeaderProps> = ({
  todoList,
  isExpanded,
  setIsExpanded,
  onDeleteList,
}) => {
  const completedCount = todoList.todos.filter(
    (todo) => todo.status === 'successful'
  ).length;
  const totalCount = todoList.todos.length;
  const formattedDate = formatDate(todoList.dueDate);

  return (
    <div className="bg-dark-bg text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent hover:text-white transition-colors shrink-0"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </Button>
          <Text
            as="h2"
            className="text-2xl font-bold truncate"
            dataTestId="todolist-title"
          >
            {todoList.name}
          </Text>
          <Text as="span" className="text-white text-sm shrink-0">
            {completedCount}/{totalCount} completed
          </Text>
          {todoList.priority && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                PRIORITY_COLORS[todoList.priority]
              }`}
            >
              {todoList.priority.charAt(0).toUpperCase() +
                todoList.priority.slice(1)}
            </span>
          )}
          {todoList.category && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-white shrink-0">
              {CATEGORY_LABELS[todoList.category] ?? todoList.category}
            </span>
          )}
          {formattedDate && (
            <span className="text-xs text-white/70 shrink-0">
              Due: {formattedDate}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Button
            onClick={() => onDeleteList(todoList.id)}
            className="px-4 py-2 bg-triadic-blue text-white rounded-lg hover:bg-dark-bg transition-colors focus:outline-none focus:ring-2 focus:ring-triadic-blue focus:ring-offset-2 focus:ring-offset-dark-bg"
            dataTestId="todolist-item-delete-button"
          >
            Delete List
          </Button>
        </div>
      </div>
      {todoList.notes && (
        <p className="mt-2 ml-10 text-sm text-white/60 truncate">
          {todoList.notes}
        </p>
      )}
    </div>
  );
};

export default TodoListHeader;
