import { TodoItem as TodoItemType } from '@fyltura/types';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-base-bg rounded-lg border-2 border-secondary-bg hover:border-accent transition-colors group">
      <input
        type="checkbox"
        checked={todo.isDone}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 rounded border-2 border-secondary-dark-bg checked:bg-accent checked:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 cursor-pointer"
      />

      <span
        className={`flex-1 text-lg ${
          todo.isDone
            ? 'line-through text-secondary-dark-bg'
            : 'text-dark-bg font-medium'
        }`}
      >
        {todo.name}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 bg-dark-bg text-white rounded hover:bg-secondary-dark-bg focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label="Delete todo"
      >
        Delete
      </button>
    </div>
  );
}

export default TodoItem;
