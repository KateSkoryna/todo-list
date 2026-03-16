import { useEffect, useState } from 'react';
import Input from '../elements/Input';
import Button from '../elements/Button';
import Text from '../elements/Text';
import { useParams } from 'react-router-dom';
import { TodoListPriority, TodoListCategory } from '@shared/types';

type TodoListFormOpts = {
  priority?: TodoListPriority;
  category?: TodoListCategory;
  dueDate?: string | null;
  notes?: string | null;
};

type TodoListFormProps = {
  onSubmit: (name: string, opts?: TodoListFormOpts) => void;
  isSubmitting: boolean;
};

const PRIORITY_OPTIONS: { value: TodoListPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const CATEGORY_OPTIONS: { value: TodoListCategory; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'education', label: 'Education' },
  { value: 'work', label: 'Work' },
  { value: 'family', label: 'Family' },
  { value: 'health', label: 'Health' },
];

const TodoListForm: React.FC<TodoListFormProps> = ({
  onSubmit,
  isSubmitting,
}: TodoListFormProps) => {
  const [newListName, setNewListName] = useState('');
  const [error, setError] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [priority, setPriority] = useState<TodoListPriority | ''>('');
  const [category, setCategory] = useState<TodoListCategory | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const { userId } = useParams<{ userId: string }>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) {
      setError('Todo list name cannot be empty.');
      return;
    }
    setError('');
    const opts: TodoListFormOpts = {
      priority: priority || undefined,
      category: category || undefined,
      dueDate: dueDate || null,
      notes: notes || null,
    };
    onSubmit(newListName.trim(), opts);
    setNewListName('');
    setPriority('');
    setCategory('');
    setDueDate('');
    setNotes('');
    setShowMore(false);
  };

  useEffect(() => {
    setNewListName('');
    setError('');
    setPriority('');
    setCategory('');
    setDueDate('');
    setNotes('');
    setShowMore(false);
  }, [userId]);

  const selectClass =
    'px-3 py-2 rounded-lg border-2 border-secondary-bg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-base-bg text-dark-bg';

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 border-2 border-secondary-bg"
    >
      <Text as="h2" className="text-xl font-bold text-dark-bg mb-4">
        Create New List
      </Text>
      <div className="flex flex-col sm:flex-row gap-3 items-baseline">
        <Text as="p" className="text-dark-bg font-medium">
          List Name:
        </Text>
        <Input
          type="text"
          value={newListName}
          onChange={(e) => {
            setNewListName(e.target.value);
            setError('');
          }}
          placeholder="Enter list name..."
          className="flex-1 px-4 py-3 rounded-lg border-2 border-secondary-bg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-base-bg text-dark-bg placeholder-secondary-dark-bg"
          inputTestId="todolist-form-input"
          id="todolist-form-input"
        />
        <Button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="px-4 py-3 bg-secondary-bg text-dark-bg font-medium rounded-lg hover:bg-accent hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {showMore ? 'Less ▲' : 'More ▼'}
        </Button>
        <Button
          type="submit"
          className="px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-dark-bg hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          disabled={isSubmitting}
          dataTestId="todolist-form-submit-button"
        >
          {isSubmitting ? 'Creating...' : 'Create List'}
        </Button>
      </div>

      {showMore && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-dark-bg"
              htmlFor="list-priority"
            >
              Priority
            </label>
            <select
              id="list-priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as TodoListPriority | '')
              }
              className={selectClass}
            >
              <option value="">No priority</option>
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-dark-bg"
              htmlFor="list-category"
            >
              Category
            </label>
            <select
              id="list-category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as TodoListCategory | '')
              }
              className={selectClass}
            >
              <option value="">No category</option>
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-dark-bg"
              htmlFor="list-due-date"
            >
              Due Date
            </label>
            <input
              id="list-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={selectClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-dark-bg"
              htmlFor="list-notes"
            >
              Notes
            </label>
            <textarea
              id="list-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              rows={2}
              className="px-3 py-2 rounded-lg border-2 border-secondary-bg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-base-bg text-dark-bg placeholder-secondary-dark-bg resize-none"
            />
          </div>
        </div>
      )}

      {error && (
        <Text
          as="p"
          className="text-red-500 mt-2"
          dataTestId="todolist-form-error"
        >
          {error}
        </Text>
      )}
    </form>
  );
};

export default TodoListForm;
