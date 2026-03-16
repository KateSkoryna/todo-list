import { useState } from 'react';
import { TodoList as TodoListType, UpdateTodoItem } from '@shared/types';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import Text from '../elements/Text';
import TodoListHeader from './TodoListHeader';

type NewTodoOpts = {
  dueDate?: string;
  location?: string;
  notes?: string;
};

interface TodoListProps {
  todoList: TodoListType;
  onAddTodo: (todolistId: string, name: string, opts?: NewTodoOpts) => void;
  onToggleTodo: (id: string, todolistId: string) => void;
  onDeleteTodo: (id: string, todolistId: string) => void;
  onDeleteList: (id: string) => void;
  onEditTodo: (id: string, todolistId: string, updates: UpdateTodoItem) => void;
  dataTestId?: string;
}

function TodoList({
  todoList,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onDeleteList,
  onEditTodo,
  dataTestId,
}: TodoListProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddTodo = (name: string, opts?: NewTodoOpts) => {
    onAddTodo(todoList.id, name, opts);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-secondary-bg"
      data-testid={dataTestId}
    >
      <TodoListHeader
        todoList={todoList}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        onDeleteList={onDeleteList}
      />

      {isExpanded && (
        <div className="p-6 bg-base-bg">
          <TodoForm onAddTodo={handleAddTodo} />

          <div className="space-y-3">
            {todoList.todos.length === 0 ? (
              <Text
                as="p"
                className="text-center text-dark-bg py-8"
                dataTestId="empty-todos-message"
              >
                No todos yet. Add one above to get started!
              </Text>
            ) : (
              todoList.todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={(id) => onToggleTodo(id, todoList.id)}
                  onDelete={(id) => onDeleteTodo(id, todoList.id)}
                  onEdit={(id, updates) => onEditTodo(id, todoList.id, updates)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
