import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Plus,
  ClipboardList,
  MapPin,
  FileText,
  Calendar,
  Trash2,
  Pencil,
  ImagePlus,
  Upload,
  Flag,
  CircleDot,
  Tag,
} from 'lucide-react';
import dayjs from 'dayjs';
import {
  TodoItem,
  TodoList,
  TodoListPriority,
  TodoListCategory,
  UpdateTodoItem,
  UpdateTodoList,
  TodoStatus,
} from '@shared/types';
import { useTodoListsData } from '../../hooks/useTodoListsData';
import { useAuthStore } from '../../store/authStore';
import { uploadImage } from '../../lib/imageUtils';
import TodoListForm from '../todo/TodoListForm';
import TodoLists from '../todo/TodoLists';
import DatePickerInput from '../elements/DatePickerInput';
import { CATEGORY_LABELS } from '../../constants/todolist.constants';

type CreateListOpts = {
  priority?: TodoListPriority;
  category?: TodoListCategory;
  dueDate?: string | null;
  notes?: string | null;
};

type SelectedTask = {
  todo: TodoItem;
  list: TodoList;
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'In Progress',
  successful: 'Completed',
  failed: 'Not Started',
};


// ─── Edit Panel ───────────────────────────────────────────────────────────────

type EditFormValues = {
  name: string;
  status: TodoStatus;
  dueDate: string;
  location: string;
  notes: string;
  listName: string;
  priority: TodoListPriority | '';
  category: TodoListCategory | '';
};

function TodoEditPanel({
  todo,
  list,
  onSave,
  onCancel,
}: {
  todo: TodoItem;
  list: TodoList;
  onSave: (todoUpdates: UpdateTodoItem, listUpdates: UpdateTodoList) => void;
  onCancel: () => void;
}) {
  const userId = useAuthStore((s) => s.user?.firebaseUid);
  const [editImage, setEditImage] = useState<string | null>(todo.image ?? null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control } = useForm<EditFormValues>({
    defaultValues: {
      name: todo.name,
      status: todo.status,
      dueDate: todo.dueDate ?? '',
      location: todo.location ?? '',
      notes: todo.notes ?? '',
      listName: list.name,
      priority: list.priority ?? '',
      category: list.category ?? '',
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setImageError(null);
    setImageUploading(true);
    try {
      const url = await uploadImage(file, userId);
      setEditImage(url);
    } catch (err) {
      setImageError((err as Error).message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setEditImage(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onFormSubmit = (data: EditFormValues) => {
    onSave(
      {
        name: data.name.trim() || todo.name,
        status: data.status,
        dueDate: data.dueDate || null,
        location: data.location.trim() || null,
        notes: data.notes.trim() || null,
        image: editImage,
      },
      {
        name: data.listName.trim() || list.name,
        priority: data.priority || undefined,
        category: data.category || undefined,
      }
    );
  };

  const labelClass = 'text-xs text-secondary-dark-bg font-medium w-20 shrink-0';
  const inputClass =
    'flex-1 px-2 py-2 rounded-lg border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm';
  const actionBtnClass =
    'w-6 h-6 flex items-center justify-center shrink-0 rounded-lg text-secondary-dark-bg transition-colors outline-none cursor-pointer';

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col h-full p-6"
    >
      <h2 className="text-xl font-bold text-dark-bg mb-5">Edit Task</h2>

      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="flex items-center gap-2">
          <label className={labelClass}>Name:</label>
          <input
            {...register('name')}
            type="text"
            className={inputClass}
            data-testid={'edit-todo-input-' + todo.id}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className={labelClass}>Status:</label>
          <select
            {...register('status')}
            className="px-2 py-2 rounded-lg border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm min-w-[160px]"
            data-testid={'edit-todo-status-' + todo.id}
          >
            <option value="pending">In Progress</option>
            <option value="successful">Completed</option>
            <option value="failed">Not Started</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className={labelClass}>Due date:</label>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                id={'edit-todo-due-date-' + todo.id}
                value={field.value ?? ''}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className={labelClass}>Location:</label>
          <input
            type="text"
            {...register('location')}
            placeholder="Optional location..."
            className={inputClass}
            data-testid={'edit-todo-location-' + todo.id}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className={labelClass}>Notes:</label>
          <textarea
            {...register('notes')}
            placeholder="Optional notes..."
            rows={3}
            className={`${inputClass} resize-none`}
            data-testid={'edit-todo-notes-' + todo.id}
          />
        </div>

        <div className="border-t border-secondary-bg pt-3 mt-1 space-y-3">
          <div className="flex items-center gap-2">
            <label className={labelClass}>List name:</label>
            <input
              {...register('listName')}
              type="text"
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className={labelClass}>Priority:</label>
            <select
              {...register('priority')}
              className="px-2 py-2 rounded-lg border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm min-w-[160px]"
            >
              <option value="">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className={labelClass}>Category:</label>
            <select
              {...register('category')}
              className="px-2 py-2 rounded-lg border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm min-w-[160px]"
            >
              <option value="">None</option>
              <option value="home">Home</option>
              <option value="education">Education</option>
              <option value="work">Work</option>
              <option value="family">Family</option>
              <option value="health">Health</option>
            </select>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <label className={`${labelClass} pt-2`}>Image:</label>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              data-testid={'edit-todo-image-' + todo.id}
            />
            {!editImage && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-secondary-bg hover:border-accent hover:bg-accent/10 text-secondary-dark-bg hover:text-dark-bg transition-colors focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {imageUploading ? (
                  <>
                    <Upload size={16} className="animate-bounce" />
                    <span className="text-sm">Uploading...</span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={16} />
                    <span className="text-sm">Choose image</span>
                  </>
                )}
              </button>
            )}
            {imageError && <p className="text-red-500 text-xs">{imageError}</p>}
            {editImage && (
              <div className="flex items-center gap-2">
                <img
                  src={editImage}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className={`${actionBtnClass} hover:text-red-500`}
                  aria-label="Remove image"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-5 border-t border-secondary-bg mt-5">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-secondary-dark-bg hover:text-dark-bg transition-colors"
          aria-label="Cancel todo edit"
          data-testid={'cancel-todo-edit-button-' + todo.id}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-accent text-dark-bg rounded-lg hover:opacity-90 transition-opacity"
          aria-label="Save todo edit"
          data-testid={'save-todo-edit-button-' + todo.id}
        >
          Save
        </button>
      </div>
    </form>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

const STATUS_TEXT_COLORS: Record<string, string> = {
  pending: 'text-triadic-orange',
  successful: 'text-green-500',
  failed: 'text-triadic-purple',
};

const PRIORITY_TEXT_COLORS: Record<string, string> = {
  high: 'text-triadic-orange',
  medium: 'text-triadic-blue',
  low: 'text-triadic-purple',
};

function TaskDetailPanel({
  todo,
  list,
  onDelete,
  onStartEdit,
}: {
  todo: TodoItem;
  list: TodoList;
  onDelete: (id: string) => void;
  onStartEdit: () => void;
}) {
  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex-1 overflow-y-auto">
        {/* Top: text info + image side by side */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-dark-bg leading-snug">
              {todo.name}
            </h2>

            <div className="space-y-2 text-sm text-secondary-dark-bg mt-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 shrink-0 text-secondary-dark-bg" />
                <span>
                  List:{' '}
                  <span className="font-medium text-dark-bg">{list.name}</span>
                </span>
              </div>
              {list.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0 text-secondary-dark-bg" />
                  <span>
                    Created: {dayjs(list.createdAt).format('DD/MM/YYYY')}
                  </span>
                </div>
              )}
              {todo.dueDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0 text-secondary-dark-bg" />
                  <span>Due: {dayjs(todo.dueDate).format('DD/MM/YYYY')}</span>
                </div>
              )}
              {todo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0 text-secondary-dark-bg" />
                  <span>{todo.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CircleDot className="w-4 h-4 shrink-0 text-secondary-dark-bg" />
                <span>
                  Status:{' '}
                  <span
                    className={`font-medium ${STATUS_TEXT_COLORS[todo.status]}`}
                  >
                    {STATUS_LABELS[todo.status]}
                  </span>
                </span>
              </div>
              {list.priority && (
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 shrink-0 text-secondary-dark-bg" />
                  <span>
                    Priority:{' '}
                    <span
                      className={`font-medium ${
                        PRIORITY_TEXT_COLORS[list.priority]
                      }`}
                    >
                      {list.priority.charAt(0).toUpperCase() +
                        list.priority.slice(1)}
                    </span>
                  </span>
                </div>
              )}
              {list.category && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 shrink-0 text-secondary-dark-bg" />
                  <span>
                    Category:{' '}
                    <span className="font-medium text-triadic-blue">
                      {CATEGORY_LABELS[list.category] ?? list.category}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {todo.image && (
            <img
              src={todo.image}
              alt="Attached"
              className="w-32 h-32 object-cover rounded-lg border border-secondary-bg shrink-0"
            />
          )}
        </div>

        {todo.notes && (
          <div className="border-t border-secondary-bg pt-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-secondary-dark-bg" />
              <span className="text-sm font-semibold text-dark-bg">Notes</span>
            </div>
            <p className="text-sm text-secondary-dark-bg leading-relaxed whitespace-pre-wrap">
              {todo.notes}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-4">
        <button
          onClick={() => onDelete(todo.id)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-triadic-orange text-white hover:opacity-90 transition-opacity"
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={onStartEdit}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-triadic-orange text-white hover:opacity-90 transition-opacity"
          aria-label="Edit task"
        >
          <Pencil size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function TasksPage() {
  const {
    todoLists,
    isLoading,
    isError,
    error,
    refetch,
    handleCreateList,
    handleDeleteList,
    handleEditList,
    handleAddTodo,
    handleDeleteTodo,
    handleEditTodo,
    createListMutationIsPending,
  } = useTodoListsData();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  function handleCreateListSubmit(name: string, opts?: CreateListOpts) {
    handleCreateList(name, opts);
    setShowCreateForm(false);
  }

  function handleSelectTodo(todo: TodoItem, list: TodoList) {
    setSelectedTask((prev) =>
      prev?.todo.id === todo.id ? null : { todo, list }
    );
    setIsEditing(false);
  }

  function handleDeleteSelectedTodo(id: string, listId: string) {
    handleDeleteTodo(id, listId);
    setSelectedTask(null);
    setIsEditing(false);
  }

  function handleSaveEdit(
    todoUpdates: UpdateTodoItem,
    listUpdates: UpdateTodoList
  ) {
    if (!selectedTask) return;
    handleEditTodo(selectedTask.todo.id, selectedTask.list.id, todoUpdates);
    handleEditList(selectedTask.list.id, listUpdates);
    setSelectedTask((prev) =>
      prev
        ? {
            todo: { ...prev.todo, ...todoUpdates },
            list: { ...prev.list, ...listUpdates },
          }
        : null
    );
    setIsEditing(false);
  }

  return (
    <div className="flex min-h-full -m-6">
      {/* Left panel */}
      <div className="flex flex-col w-1/2 border-r border-secondary-bg">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-2xl font-bold text-dark-bg">My Tasks</h2>
              <div className="h-0.5 w-14 bg-triadic-orange mt-1.5" />
            </div>
            <button
              onClick={() => setShowCreateForm((v) => !v)}
              className="flex items-center gap-1.5 px-4 py-2 bg-triadic-orange text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              New List
            </button>
          </div>

          {showCreateForm && (
            <div className="mt-4">
              <TodoListForm
                onSubmit={handleCreateListSubmit}
                isSubmitting={createListMutationIsPending}
              />
            </div>
          )}
        </div>

        <div className="flex-1 px-6 pb-6">
          <TodoLists
            todoLists={todoLists}
            isLoading={isLoading}
            isError={isError}
            error={error}
            refetch={refetch}
            handleDeleteList={handleDeleteList}
            handleAddTodo={handleAddTodo}
            selectedTodoId={selectedTask?.todo.id ?? null}
            onSelectTodo={handleSelectTodo}
          />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col w-1/2">
        {selectedTask ? (
          isEditing ? (
            <TodoEditPanel
              todo={selectedTask.todo}
              list={selectedTask.list}
              onSave={handleSaveEdit}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <TaskDetailPanel
              todo={selectedTask.todo}
              list={selectedTask.list}
              onDelete={(id) =>
                handleDeleteSelectedTodo(id, selectedTask.list.id)
              }
              onStartEdit={() => setIsEditing(true)}
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-secondary-dark-bg gap-3 p-6">
            <ClipboardList className="w-16 h-16 opacity-20" />
            <p className="text-base font-medium opacity-40">
              Select a task to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksPage;
