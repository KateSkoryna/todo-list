import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { uploadImage } from '../../lib/imageUtils';
import { useAuthStore } from '../../store/authStore';
import {
  TodoItem as TodoItemType,
  UpdateTodoItem,
  TodoStatus,
  TodoListPriority,
} from '@shared/types';
import { PRIORITY_COLORS } from '../../constants/todolist.constants';
import Button from '../elements/Button';
import Input from '../elements/Input';

interface TodoItemProps {
  todo: TodoItemType;
  listPriority?: TodoListPriority;
  isSelected?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: UpdateTodoItem) => void;
  onSelect?: () => void;
}

type FormValues = {
  name: string;
  status: TodoStatus;
  dueDate: string;
  location: string;
  notes: string;
};

const STATUS_DOT: Record<TodoStatus, string> = {
  pending: 'border-2 border-amber-400 bg-transparent',
  successful: 'bg-green-500 border-2 border-green-500',
  failed: 'bg-red-500 border-2 border-red-500',
};

const STATUS_LABELS: Record<TodoStatus, string> = {
  pending: 'In Progress',
  successful: 'Completed',
  failed: 'Not Started',
};

const STATUS_TEXT: Record<TodoStatus, string> = {
  pending: 'text-amber-600',
  successful: 'text-green-600',
  failed: 'text-red-500',
};

function TodoItem({
  todo,
  listPriority,
  isSelected,
  onToggle,
  onDelete,
  onEdit,
  onSelect,
}: TodoItemProps) {
  const userId = useAuthStore((s) => s.user?.firebaseUid);
  const [isEditing, setIsEditing] = useState(false);
  const [editImage, setEditImage] = useState<string | null>(todo.image ?? null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (dayjs(todo.dueDate).endOf('day').isBefore(dayjs())) {
        onEdit(todo.id, { status: 'failed' });
      }
    }
    // intentionally runs once on mount to auto-fail overdue items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todo.id]);

  const handleCancelEdit = () => {
    reset();
    setEditImage(todo.image ?? null);
    setImageError(null);
    setIsEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setImageError(null);
    setImageUploading(true);
    try {
      const url = await uploadImage(file, userId);
      setEditImage(url);
    } catch (err) {
      setImageError((err as Error).message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setEditImage(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onFormSubmit = (data: FormValues) => {
    onEdit(todo.id, {
      name: data.name.trim() || todo.name,
      status: data.status,
      dueDate: data.dueDate || null,
      location: data.location.trim() || null,
      notes: data.notes.trim() || null,
      image: editImage,
    });
    setIsEditing(false);
  };

  const labelClass = 'text-xs text-secondary-dark-bg font-medium';
  const inputClass =
    'flex-1 px-2 py-1 rounded border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm';

  return (
    <div
      className={`rounded-xl border-2 transition-colors group ${
        isSelected
          ? 'border-triadic-orange bg-white shadow-md'
          : 'border-secondary-bg bg-white hover:border-triadic-orange/50'
      }`}
      data-testid={'todo-item-' + todo.id}
    >
      {/* Card body — clickable for selection */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => !isEditing && onSelect?.()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isEditing) onSelect?.();
        }}
      >
        {/* Status circle */}
        <span
          className={`w-5 h-5 rounded-full shrink-0 mt-0.5 ${
            STATUS_DOT[todo.status]
          }`}
          title={todo.status}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold text-dark-bg leading-snug ${
              todo.status === 'successful'
                ? 'line-through text-secondary-dark-bg'
                : ''
            }`}
          >
            {todo.name}
          </p>
          {todo.notes && (
            <p className="text-xs text-secondary-dark-bg mt-0.5 line-clamp-2">
              {todo.notes}
            </p>
          )}

          {/* Image thumbnail */}
          {todo.image && (
            <img
              src={todo.image}
              alt="Attached"
              className="mt-2 h-16 w-16 object-cover rounded"
            />
          )}

          {/* Footer badges */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {listPriority && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[listPriority]}`}
              >
                {listPriority.charAt(0).toUpperCase() + listPriority.slice(1)}
              </span>
            )}
            <span className={`text-xs font-medium ${STATUS_TEXT[todo.status]}`}>
              {STATUS_LABELS[todo.status]}
            </span>
            {todo.dueDate && (
              <span className="text-xs text-secondary-dark-bg">
                {dayjs(todo.dueDate).format('DD/MM/YYYY')}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div
          className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={todo.status === 'successful'}
            onChange={() => onToggle(todo.id)}
            className="w-4 h-4 rounded border-2 border-secondary-dark-bg checked:bg-accent checked:border-accent cursor-pointer focus:ring-2 focus:ring-accent focus:ring-offset-1"
            aria-label={`Mark ${todo.name} as ${
              todo.status === 'successful' ? 'incomplete' : 'complete'
            }`}
            data-testid={'todo-item-complete-checkbox-' + todo.id}
          />
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-2 py-1 text-xs bg-dark-bg text-white rounded hover:bg-secondary-dark-bg focus:outline-none"
            aria-label="Edit todo"
            dataTestId={'edit-todo-button-' + todo.id}
          >
            Edit
          </Button>
          <Button
            type="button"
            onClick={() => onDelete(todo.id)}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            aria-label="Delete todo"
            dataTestId={'todo-item-delete-button-' + todo.id}
          >
            Del
          </Button>
        </div>
      </div>

      {/* Inline edit form */}
      {isEditing && (
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="border-t border-secondary-bg p-4 space-y-2 bg-base-bg"
          onClick={(e) => e.stopPropagation()}
        >
          <Input
            {...register('name')}
            id={'edit-todo-input-' + todo.id}
            type="text"
            className="w-full px-3 py-2 rounded border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm"
            inputTestId={'edit-todo-input-' + todo.id}
          />
          <div className="flex items-center gap-2">
            <label className={labelClass}>Status:</label>
            <select
              {...register('status')}
              className="px-2 py-1 rounded border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm"
              data-testid={'edit-todo-status-' + todo.id}
            >
              <option value="pending">In Progress</option>
              <option value="successful">Completed</option>
              <option value="failed">Not Started</option>
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
          <div className="flex items-start gap-2">
            <label className={`${labelClass} mt-1`}>Image:</label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="text-sm text-dark-bg"
                data-testid={'edit-todo-image-' + todo.id}
              />
              {imageUploading && (
                <p className="text-sm text-secondary-dark-bg">Uploading...</p>
              )}
              {imageError && (
                <p className="text-red-500 text-xs">{imageError}</p>
              )}
              {editImage && (
                <div className="flex items-center gap-2">
                  <img
                    src={editImage}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1.5 text-sm bg-gray-200 text-dark-bg rounded hover:bg-gray-300"
              aria-label="Cancel todo edit"
              dataTestId={'cancel-todo-edit-button-' + todo.id}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-3 py-1.5 text-sm bg-accent text-black rounded hover:bg-accent-dark"
              aria-label="Save todo edit"
              dataTestId={'save-todo-edit-button-' + todo.id}
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TodoItem;
