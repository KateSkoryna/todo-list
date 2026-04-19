import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { TodoListPriority, TodoListCategory } from '@shared/types';
import Input from '../elements/Input';
import Button from '../elements/Button';
import Text from '../elements/Text';
import DetailsSelect from '../elements/DetailsSelect';
import DatePickerInput from '../elements/DatePickerInput';
import {
  PRIORITY_OPTIONS,
  CATEGORY_OPTIONS,
} from '../../constants/todolist.constants';

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

type FormValues = {
  name: string;
  priority: TodoListPriority | '';
  category: TodoListCategory | '';
  dueDate: string;
  notes: string;
};

const TodoListForm: React.FC<TodoListFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const [showMore, setShowMore] = useState(false);
  const { userId } = useParams<{ userId: string }>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      priority: '',
      category: '',
      dueDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    reset();
    setShowMore(false);
  }, [userId, reset]);

  const onFormSubmit = (data: FormValues) => {
    const opts: TodoListFormOpts = {
      priority: data.priority || undefined,
      category: data.category || undefined,
      dueDate: data.dueDate || null,
      notes: data.notes || null,
    };
    onSubmit(data.name, opts);
    reset();
    setShowMore(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
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
          {...register('name', { required: 'Todo list name cannot be empty.' })}
          type="text"
          placeholder="Enter list name..."
          className={`flex-1 px-4 py-2 rounded-lg border-2 ${
            errors.name ? 'border-red-500' : 'border-secondary-bg'
          } focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-base-bg text-dark-bg placeholder-secondary-dark-bg`}
          inputTestId="todolist-form-input"
          id="todolist-form-input"
        />
        <Button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="px-4 py-2 bg-secondary-bg text-dark-bg font-medium rounded hover:bg-accent hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {showMore ? 'Less ▲' : 'More ▼'}
        </Button>
        <Button
          type="submit"
          className="px-6 py-2 bg-accent text-black font-semibold rounded hover:bg-dark-bg hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          disabled={isSubmitting}
          dataTestId="todolist-form-submit-button"
        >
          {isSubmitting ? 'Creating...' : 'Create List'}
        </Button>
      </div>

      {errors.name && (
        <Text
          as="p"
          className="text-red-500 mt-2"
          dataTestId="todolist-form-error"
        >
          {errors.name.message}
        </Text>
      )}

      {showMore && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-dark-bg"
              htmlFor="list-priority"
            >
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <DetailsSelect
                  id="list-priority"
                  value={field.value}
                  onChange={field.onChange}
                  options={PRIORITY_OPTIONS}
                  placeholder="No priority"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-dark-bg"
              htmlFor="list-category"
            >
              Category
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <DetailsSelect
                  id="list-category"
                  value={field.value}
                  onChange={field.onChange}
                  options={CATEGORY_OPTIONS}
                  placeholder="No category"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium text-dark-bg"
              htmlFor="list-due-date"
            >
              Due Date
            </label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DatePickerInput
                  id="list-due-date"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
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
              {...register('notes')}
              placeholder="Optional notes..."
              rows={2}
              className="px-3 py-2 rounded-lg border-2 border-secondary-bg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-base-bg text-dark-bg placeholder-secondary-dark-bg resize-none"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoListForm;
