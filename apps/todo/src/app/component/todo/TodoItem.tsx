import { useState } from 'react';
import { TodoItem as TodoItemType } from '@fyltura/types';
import Button from '../elements/Button';
import Text from '../elements/Text';
import Input from '../elements/Input';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, mame: string) => void;
}

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(todo.name);

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleEditSubmit = () => {
    if (editedName.trim() && editedName !== todo.name) {
      onEdit(todo.id, editedName);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(todo.name);
  };

  return (
    <div
      className={`flex w-full flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-4 bg-base-bg rounded-lg border-2 border-secondary-bg hover:border-accent transition-colors group${
        todo.isDone ? ' completed' : ''
      }`}
      data-testid={'todo-item-' + todo.id}
    >
      <Input
        type="checkbox"
        checked={todo.isDone}
        onChange={handleToggle}
        className="w-5 h-5 shrink-0 rounded border-2 border-secondary-dark-bg checked:bg-accent checked:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 cursor-pointer"
        aria-label={`Mark ${todo.name} as ${
          todo.isDone ? 'not complete' : 'complete'
        }`}
        inputTestId={'todo-item-complete-checkbox-' + todo.id}
      />

      {isEditing ? (
        <Input
          id={'edit-todo-input-' + todo.id}
          type="text"
          value={editedName}
          onChange={handleEditChange}
          onBlur={handleEditSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleEditSubmit();
            } else if (e.key === 'Escape') {
              handleCancelEdit();
            }
          }}
          className=" w-full text-lg p-2 rounded border border-gray-300"
          inputTestId={'edit-todo-input-' + todo.id}
        />
      ) : (
        <Text
          as="span"
          className={` w-full text-lg ${
            todo.isDone
              ? 'line-through text-dark-bg'
              : 'text-dark-bg font-medium'
          }`}
        >
          {todo.name}
        </Text>
      )}

      <div className="w-full flex justify-center sm:justify-end gap-2 mt-2 sm:mt-0">
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
  );
}

export default TodoItem;
