import { useState } from 'react';
import Input from '../elements/Input';
import Button from '../elements/Button';

type NewTodoOpts = {
  dueDate?: string;
  location?: string;
  notes?: string;
};

type FormProps = {
  onAddTodo: (name: string, opts?: NewTodoOpts) => void;
};

const TodoForm: React.FC<FormProps> = ({ onAddTodo }) => {
  const [newTodoName, setNewTodoName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showExtra, setShowExtra] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoName.trim()) {
      const opts: NewTodoOpts = {};
      if (dueDate) opts.dueDate = dueDate;
      if (location.trim()) opts.location = location.trim();
      if (notes.trim()) opts.notes = notes.trim();
      onAddTodo(
        newTodoName.trim(),
        Object.keys(opts).length ? opts : undefined
      );
      setNewTodoName('');
      setDueDate('');
      setLocation('');
      setNotes('');
      setErrorMessage('');
    } else {
      setErrorMessage('Title cannot be empty.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoName(e.target.value);
    if (errorMessage && e.target.value.trim()) {
      setErrorMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-baseline">
        <label htmlFor="new-todo-name" className="text-dark-bg font-medium">
          Todo Name:
        </label>
        <Input
          id="new-todo-name"
          type="text"
          value={newTodoName}
          onChange={handleInputChange}
          placeholder="Add a new todo..."
          className={`flex-1 px-4 py-3 rounded-lg border-2 ${
            errorMessage ? 'border-red-500' : 'border-secondary-bg'
          } focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-white text-dark-bg placeholder-secondary-dark-bg`}
          inputTestId="todo-form-input"
        />
        <Button
          type="submit"
          className="px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-dark-bg hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          dataTestId="todo-form-submit-button"
        >
          Add
        </Button>
      </div>
      {errorMessage && (
        <p
          className="text-red-500 text-sm mt-1"
          data-testid="todo-error-message"
        >
          {errorMessage}
        </p>
      )}
      <button
        type="button"
        onClick={() => setShowExtra((v) => !v)}
        className="mt-2 text-sm text-secondary-dark-bg hover:text-dark-bg underline focus:outline-none"
        data-testid="todo-form-toggle-extra"
      >
        {showExtra ? 'Hide options' : 'More options'}
      </button>
      {showExtra && (
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 items-baseline">
            <label
              htmlFor="new-todo-due-date"
              className="text-dark-bg font-medium w-24"
            >
              Due date:
            </label>
            <input
              id="new-todo-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-2 rounded-lg border-2 border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg"
              data-testid="todo-form-due-date"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-baseline">
            <label
              htmlFor="new-todo-location"
              className="text-dark-bg font-medium w-24"
            >
              Location:
            </label>
            <input
              id="new-todo-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Optional location..."
              className="flex-1 px-3 py-2 rounded-lg border-2 border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg placeholder-secondary-dark-bg"
              data-testid="todo-form-location"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-baseline">
            <label
              htmlFor="new-todo-notes"
              className="text-dark-bg font-medium w-24"
            >
              Notes:
            </label>
            <textarea
              id="new-todo-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              rows={2}
              className="flex-1 px-3 py-2 rounded-lg border-2 border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg placeholder-secondary-dark-bg resize-none"
              data-testid="todo-form-notes"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoForm;
