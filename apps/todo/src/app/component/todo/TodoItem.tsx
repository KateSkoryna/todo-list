import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  TodoItem as TodoItemType,
  UpdateTodoItem,
  TodoStatus,
} from '@shared/types';
import Button from '../elements/Button';
import Text from '../elements/Text';
import Input from '../elements/Input';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: UpdateTodoItem) => void;
}

type FormValues = {
  name: string;
  status: TodoStatus;
  dueDate: string;
  location: string;
  notes: string;
};

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: todo.name,
      status: todo.status,
      dueDate: todo.dueDate ?? '',
      location: todo.location ?? '',
      notes: todo.notes ?? '',
    },
  });

  useEffect(() => {
    if (todo.status === 'pending' && todo.dueDate) {
      const due = new Date(todo.dueDate);
      due.setHours(23, 59, 59, 999);
      if (due < new Date()) {
        onEdit(todo.id, { status: 'failed' });
      }
    }
    // intentionally runs once on mount to auto-fail overdue items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todo.id]);

  const STATUS_DOT: Record<TodoStatus, string> = {
    pending: 'bg-yellow-400',
    successful: 'bg-green-500',
    failed: 'bg-red-500',
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  const onFormSubmit = (data: FormValues) => {
    onEdit(todo.id, {
      name: data.name.trim() || todo.name,
      status: data.status,
      dueDate: data.dueDate || null,
      location: data.location.trim() || null,
      notes: data.notes.trim() || null,
    });
    setIsEditing(false);
  };

  const labelClass = 'text-xs text-secondary-dark-bg font-medium';
  const inputClass =
    'flex-1 px-2 py-1 rounded border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm';

  return (
    <div
      className={`flex w-full flex-col gap-2 p-4 bg-base-bg rounded-lg border-2 border-secondary-bg hover:border-accent transition-colors group${
        todo.status === 'successful' ? ' completed' : ''
      }`}
      data-testid={'todo-item-' + todo.id}
    >
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <Input
            type="checkbox"
            checked={todo.status === 'successful'}
            onChange={() => onToggle(todo.id)}
            className="w-5 h-5 shrink-0 rounded border-2 border-secondary-dark-bg checked:bg-accent checked:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 cursor-pointer"
            aria-label={`Mark ${todo.name} as ${
              todo.status === 'successful' ? 'not complete' : 'complete'
            }`}
            inputTestId={'todo-item-complete-checkbox-' + todo.id}
          />

          {isEditing ? (
            <Input
              {...register('name')}
              id={'edit-todo-input-' + todo.id}
              type="text"
              className="w-full text-lg p-2 rounded border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg"
              inputTestId={'edit-todo-input-' + todo.id}
            />
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Text
                as="span"
                className={`text-lg leading-none ${
                  todo.status === 'successful'
                    ? 'line-through text-dark-bg'
                    : 'text-dark-bg font-medium'
                }`}
              >
                {todo.name}
              </Text>
              <span
                className={`shrink-0 w-3 h-3 rounded-full ${
                  STATUS_DOT[todo.status]
                }`}
                title={todo.status}
              />
            </div>
          )}

          <div className="w-full sm:w-auto flex justify-center sm:justify-end gap-2 mt-2 sm:mt-0 shrink-0">
            <Button
              type="button"
              onClick={() => onDelete(todo.id)}
              className="px-3 py-1 bg-triadic-blue text-white rounded hover:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-triadic-blue"
              aria-label="Delete todo"
              dataTestId={'todo-item-delete-button-' + todo.id}
            >
              Delete
            </Button>

            {isEditing ? (
              <>
                <Button
                  type="submit"
                  className="px-3 py-1 bg-accent text-black rounded hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent"
                  aria-label="Save todo edit"
                  dataTestId={'save-todo-edit-button-' + todo.id}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  aria-label="Cancel todo edit"
                  dataTestId={'cancel-todo-edit-button-' + todo.id}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={handleEdit}
                className="px-3 py-1 bg-dark-bg text-white rounded hover:bg-secondary-dark-bg focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Edit todo"
                dataTestId={'edit-todo-button-' + todo.id}
              >
                Edit
              </Button>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex flex-col gap-2 mt-1 pl-7">
            <div className="flex items-center gap-2">
              <label className={labelClass}>Status:</label>
              <select
                {...register('status')}
                className="px-2 py-1 rounded border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm"
                data-testid={'edit-todo-status-' + todo.id}
              >
                <option value="pending">Pending</option>
                <option value="successful">Successful</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className={labelClass}>Due date:</label>
              <input
                type="date"
                {...register('dueDate')}
                className="px-2 py-1 rounded border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm"
                data-testid={'edit-todo-due-date-' + todo.id}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className={labelClass}>Location:</label>
              <input
                type="text"
                {...register('location')}
                placeholder="Optional location..."
                className={inputClass}
                data-testid={'edit-todo-location-' + todo.id}
              />
            </div>
            <div className="flex items-start gap-2">
              <label className={`${labelClass} mt-1`}>Notes:</label>
              <textarea
                {...register('notes')}
                placeholder="Optional notes..."
                rows={2}
                className="flex-1 px-2 py-1 rounded border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm resize-none"
                data-testid={'edit-todo-notes-' + todo.id}
              />
            </div>
          </div>
        )}
      </form>

      {!isEditing && (todo.dueDate || todo.location || todo.notes) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 pl-7 text-sm text-secondary-dark-bg">
          {todo.dueDate && (
            <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
          )}
          {todo.location && (
            <span>
              <span role="img" aria-label="location">
                📍
              </span>{' '}
              {todo.location}
            </span>
          )}
          {todo.notes && (
            <span className="truncate max-w-xs">
              <span role="img" aria-label="notes">
                📝
              </span>{' '}
              {todo.notes}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default TodoItem;
