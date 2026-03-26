import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

type FormValues = {
  name: string;
  dueDate: string;
  location: string;
  notes: string;
};

const TodoForm: React.FC<FormProps> = ({ onAddTodo }) => {
  const [showExtra, setShowExtra] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', dueDate: '', location: '', notes: '' },
  });

  const onFormSubmit = (data: FormValues) => {
    const opts: NewTodoOpts = {};
    if (data.dueDate) opts.dueDate = data.dueDate;
    if (data.location.trim()) opts.location = data.location.trim();
    if (data.notes.trim()) opts.notes = data.notes.trim();
    onAddTodo(data.name.trim(), Object.keys(opts).length ? opts : undefined);
    reset();
    setShowExtra(false);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 items-baseline">
        <label htmlFor="new-todo-name" className="text-dark-bg font-medium">
          Todo Name:
        </label>
        <Input
          {...register('name', { required: 'Title cannot be empty.' })}
          id="new-todo-name"
          type="text"
          placeholder="Add a new todo..."
          className={`flex-1 px-4 py-3 rounded-lg border-2 ${
            errors.name ? 'border-red-500' : 'border-secondary-bg'
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

      {errors.name && (
        <p
          className="text-red-500 text-sm mt-1"
          data-testid="todo-error-message"
        >
          {errors.name.message}
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
              {...register('dueDate')}
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
              {...register('location')}
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
              {...register('notes')}
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
