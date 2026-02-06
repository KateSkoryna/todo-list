import React from 'react';
import { TodoList as TodoListType } from '@fyltura/types';
import Button from './Button';
import Text from './Text';

interface TodoListHeaderProps {
  todoList: TodoListType;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onDeleteList: (id: string) => void;
}

const TodoListHeader: React.FC<TodoListHeaderProps> = ({
  todoList,
  isExpanded,
  setIsExpanded,
  onDeleteList,
}) => {
  const completedCount = todoList.todos.filter((todo) => todo.isDone).length;
  const totalCount = todoList.todos.length;

  return (
    <div className="bg-dark-bg text-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-accent hover:text-white transition-colors"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? '▼' : '▶'}
        </Button>
        <Text as="h2" className="text-2xl font-bold">
          {todoList.name}
        </Text>
        <Text as="span" className="text-white text-sm">
          {completedCount}/{totalCount} completed
        </Text>
      </div>
      <Button
        onClick={() => onDeleteList(todoList.id)}
        className="px-4 py-2 bg-secondary-bg text-black rounded hover:bg-accent hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-bg"
      >
        Delete List
      </Button>
    </div>
  );
};

export default TodoListHeader;
