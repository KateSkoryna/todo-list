import { useState } from 'react';
import { TodoList as TodoListType } from '@fyltura/types';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import Text from '../elements/Text';
import TodoListHeader from './TodoListHeader';

interface TodoListProps {
  todoList: TodoListType;
  onAddTodo: (todolistId: string, name: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteList: (id: string) => void;
  onEditTodo: (id: string, newName: string) => void;
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

  const handleAddTodo = (name: string) => {
    onAddTodo(todoList.id, name);
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
                  onToggle={onToggleTodo}
                  onDelete={onDeleteTodo}
                  onEdit={onEditTodo}
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
