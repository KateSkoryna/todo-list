import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import Text from './Text';

type TodoListFormProps = {
  onSubmit: (name: string) => void;
  isSubmitting: boolean;
};

const TodoListForm: React.FC<TodoListFormProps> = ({
  onSubmit,
  isSubmitting,
}: TodoListFormProps) => {
  const [newListName, setNewListName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onSubmit(newListName.trim());
      setNewListName('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 border-2 border-secondary-bg"
    >
      <Text as="h2" className="text-xl font-bold text-dark-bg mb-4">
        Create New List
      </Text>
      <div className="flex flex-col sm:flex-row gap-3 items-baseline">
        <label htmlFor="new-list-name" className="text-dark-bg font-medium">
          New List Name:
        </label>
        <Input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter list name..."
          className="flex-1 px-4 py-3 rounded-lg border-2 border-secondary-bg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-base-bg text-dark-bg placeholder-secondary-dark-bg"
        />
        <Button
          type="submit"
          className="px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-dark-bg hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create List'}
        </Button>
      </div>
    </form>
  );
};

export default TodoListForm;
