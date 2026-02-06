import { useState } from 'react';
import Input from './Input';
import Button from './Button';

type FormProps = {
  onAddTodo: (name: string) => void;
};

const TodoForm: React.FC<FormProps> = ({ onAddTodo }) => {
  const [newTodoName, setNewTodoName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoName.trim()) {
      onAddTodo(newTodoName.trim());
      setNewTodoName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-baseline">
        <label htmlFor="new-todo-name" className="text-dark-bg font-medium">Todo Name:</label>
        <Input
          id="new-todo-name"
          type="text"
          value={newTodoName}
          onChange={(e) => setNewTodoName(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-3 rounded-lg border-2 border-secondary-bg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-white text-dark-bg placeholder-secondary-dark-bg"
        />
        <Button
          type="submit"
          className="px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-dark-bg hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        >
          Add
        </Button>
      </div>
    </form>
  );
};

export default TodoForm;
