import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../elements/Input';
import Button from '../elements/Button';
import { uploadImage } from '../../lib/imageUtils';
import { useAuthStore } from '../../store/authStore';

type NewTodoOpts = {
  dueDate?: string;
  location?: string;
  notes?: string;
  image?: string | null;
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
  const userId = useAuthStore((s) => s.user?.firebaseUid);
  const [showExtra, setShowExtra] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', dueDate: '', location: '', notes: '' },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setImageError(null);
    setImageUploading(true);
    try {
      const url = await uploadImage(file, userId);
      setImage(url);
    } catch (err) {
      setImageError((err as Error).message);
      setImage(null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onFormSubmit = (data: FormValues) => {
    const opts: NewTodoOpts = {};
    if (data.dueDate) opts.dueDate = data.dueDate;
    if (data.location.trim()) opts.location = data.location.trim();
    if (data.notes.trim()) opts.notes = data.notes.trim();
    if (image) opts.image = image;
    onAddTodo(data.name.trim(), Object.keys(opts).length ? opts : undefined);
    reset();
    setShowExtra(false);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
          <div className="flex flex-col sm:flex-row gap-3 items-baseline">
            <label
              htmlFor="new-todo-image"
              className="text-dark-bg font-medium w-24"
            >
              Image:
            </label>
            <div className="flex flex-col gap-2">
              <input
                id="new-todo-image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="text-sm text-dark-bg"
                data-testid="todo-form-image"
              />
              {imageUploading && (
                <p className="text-sm text-secondary-dark-bg">Uploading...</p>
              )}
              {imageError && (
                <p className="text-red-500 text-sm">{imageError}</p>
              )}
              {image && (
                <div className="flex items-center gap-2">
                  <img
                    src={image}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-sm text-red-500 hover:text-red-700 underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoForm;
