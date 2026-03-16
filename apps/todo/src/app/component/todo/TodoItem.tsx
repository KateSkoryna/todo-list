import { useState } from 'react';
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

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(todo.name);
  const [editedStatus, setEditedStatus] = useState<TodoStatus>(todo.status);
  const [editedDueDate, setEditedDueDate] = useState(todo.dueDate ?? '');
  const [editedLocation, setEditedLocation] = useState(todo.location ?? '');
  const [editedNotes, setEditedNotes] = useState(todo.notes ?? '');

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    const updates: UpdateTodoItem = {
      name: editedName.trim() || todo.name,
      status: editedStatus,
      dueDate: editedDueDate || null,
      location: editedLocation.trim() || null,
      notes: editedNotes.trim() || null,
    };
    onEdit(todo.id, updates);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(todo.name);
    setEditedStatus(todo.status);
    setEditedDueDate(todo.dueDate ?? '');
    setEditedLocation(todo.location ?? '');
    setEditedNotes(todo.notes ?? '');
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        <Input
          type="checkbox"
          checked={todo.status === 'successful'}
          onChange={handleToggle}
          className="w-5 h-5 shrink-0 rounded border-2 border-secondary-dark-bg checked:bg-accent checked:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 cursor-pointer"
          aria-label={`Mark ${todo.name} as ${
            todo.status === 'successful' ? 'not complete' : 'complete'
          }`}
          inputTestId={'todo-item-complete-checkbox-' + todo.id}
        />

        {isEditing ? (
          <Input
            id={'edit-todo-input-' + todo.id}
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSubmit();
              else if (e.key === 'Escape') handleCancelEdit();
            }}
            className="w-full text-lg p-2 rounded border border-gray-300"
            inputTestId={'edit-todo-input-' + todo.id}
          />
        ) : (
          <Text
            as="span"
            className={`w-full text-lg ${
              todo.status === 'successful'
                ? 'line-through text-dark-bg'
                : 'text-dark-bg font-medium'
            }`}
          >
            {todo.name}
          </Text>
        )}

        <div className="w-full sm:w-auto flex justify-center sm:justify-end gap-2 mt-2 sm:mt-0 shrink-0">
          <Button
            onClick={handleDelete}
            className="px-3 py-1 bg-dark-bg text-white rounded hover:bg-secondary-dark-bg focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Delete todo"
            dataTestId={'todo-item-delete-button-' + todo.id}
          >
            Delete
          </Button>

          {isEditing ? (
            <>
              <Button
                onClick={handleEditSubmit}
                className="px-3 py-1 bg-accent text-black rounded hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Save todo edit"
                dataTestId={'save-todo-edit-button-' + todo.id}
              >
                Save
              </Button>
              <Button
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

      {isEditing ? (
        <div className="flex flex-col gap-2 mt-1 pl-7">
          <div className="flex items-center gap-2">
            <label className={labelClass}>Status:</label>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value as TodoStatus)}
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
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="px-2 py-1 rounded border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm"
              data-testid={'edit-todo-due-date-' + todo.id}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className={labelClass}>Location:</label>
            <input
              type="text"
              value={editedLocation}
              onChange={(e) => setEditedLocation(e.target.value)}
              placeholder="Optional location..."
              className={inputClass}
              data-testid={'edit-todo-location-' + todo.id}
            />
          </div>
          <div className="flex items-start gap-2">
            <label className={`${labelClass} mt-1`}>Notes:</label>
            <textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              placeholder="Optional notes..."
              rows={2}
              className="flex-1 px-2 py-1 rounded border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm resize-none"
              data-testid={'edit-todo-notes-' + todo.id}
            />
          </div>
        </div>
      ) : (
        (todo.dueDate ||
          todo.location ||
          todo.notes ||
          todo.status === 'failed') && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 pl-7 text-sm text-secondary-dark-bg">
            {todo.status === 'failed' && (
              <span className="text-red-500 font-medium">Failed</span>
            )}
            {todo.dueDate && (
              <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
            )}
            {todo.location && <span>📍 {todo.location}</span>}
            {todo.notes && (
              <span className="truncate max-w-xs">📝 {todo.notes}</span>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default TodoItem;
