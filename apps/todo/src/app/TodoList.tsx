import { useState } from 'react';
import { TodoList as TodoListType } from '@fyltura/types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todoList: TodoListType;
  onAddTodo: (todolistId: string, name: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteList: (id: string) => void;
}

export function TodoList({
  todoList,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onDeleteList,
}: TodoListProps) {
  const [newTodoName, setNewTodoName] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoName.trim()) {
      onAddTodo(todoList.id, newTodoName.trim());
      setNewTodoName('');
    }
  };

  const completedCount = todoList.todos.filter((todo) => todo.isDone).length;
  const totalCount = todoList.todos.length;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-secondary-bg">
      <div className="bg-dark-bg text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent hover:text-white transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <h2 className="text-2xl font-bold">{todoList.name}</h2>
          <span className="text-secondary-dark-bg text-sm">
            {completedCount}/{totalCount} completed
          </span>
        </div>
        <button
          onClick={() => onDeleteList(todoList.id)}
          className="px-4 py-2 bg-secondary-bg text-black rounded hover:bg-accent hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-bg"
        >
          Delete List
        </button>
      </div>

      {isExpanded && (
        <div className="p-6 bg-base-bg">
          <form onSubmit={handleAddTodo} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTodoName}
                onChange={(e) => setNewTodoName(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1 px-4 py-3 rounded-lg border-2 border-secondary-bg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-white text-dark-bg placeholder-secondary-dark-bg"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-dark-bg hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                Add
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {todoList.todos.length === 0 ? (
              <p className="text-center text-secondary-dark-bg py-8">
                No todos yet. Add one above to get started!
              </p>
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
