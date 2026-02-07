import { useState } from 'react';
import Input from './Input';
import Button from './Button';

type FormProps = {
  onAddTodo: (name: string) => void;
};

const TodoForm: React.FC<FormProps> = ({ onAddTodo }) => {
  const [newTodoName, setNewTodoName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoName.trim()) {
      onAddTodo(newTodoName.trim());
      setNewTodoName('');
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
    </form>
  );
};

export default TodoForm;
