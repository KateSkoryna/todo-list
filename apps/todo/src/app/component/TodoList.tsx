import { useState } from 'react';
import { TodoList as TodoListType } from '@fyltura/types';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import Text from './Text';
import TodoListHeader from './TodoListHeader';

interface TodoListProps {
  todoList: TodoListType;
  onAddTodo: (todolistId: string, name: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteList: (id: string) => void;
}

function TodoList({
  todoList,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onDeleteList,
}: TodoListProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddTodo = (name: string) => {
    onAddTodo(todoList.id, name);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-secondary-bg">
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
              <Text as="p" className="text-center text-dark-bg py-8">
                No todos yet. Add one above to get started!
              </Text>
            ) : (
              todoList.todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggleTodo}
                  onDelete={onDeleteTodo}
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
