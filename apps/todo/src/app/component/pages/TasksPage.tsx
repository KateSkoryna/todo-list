import { useState } from 'react';
import { Plus, ClipboardList, MapPin, FileText, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import {
  TodoItem,
  TodoList,
  TodoListPriority,
  TodoListCategory,
  UpdateTodoItem,
} from '@shared/types';
import { useTodoListsData } from '../../hooks/useTodoListsData';
import TodoListForm from '../todo/TodoListForm';
import TodoLists from '../todo/TodoLists';
import {
  PRIORITY_COLORS,
  CATEGORY_LABELS,
} from '../../constants/todolist.constants';

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

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50 border border-amber-200',
  successful: 'text-green-600 bg-green-50 border border-green-200',
  failed: 'text-red-600 bg-red-50 border border-red-200',
};

function TaskDetailPanel({
  todo,
  list,
  onClose,
  onDeleteTodo,
  onEditTodo,
}: {
  todo: TodoItem;
  list: TodoList;
  onClose: () => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, updates: UpdateTodoItem) => void;
}) {
  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex-1">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark-bg leading-snug">
            {todo.name}
          </h2>
          <p className="text-sm text-secondary-dark-bg mt-1">
            List: <span className="font-medium text-dark-bg">{list.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {list.priority && (
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                PRIORITY_COLORS[list.priority]
              }`}
            >
              Priority:{' '}
              {list.priority.charAt(0).toUpperCase() + list.priority.slice(1)}
            </span>
          )}
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              STATUS_COLORS[todo.status]
            }`}
          >
            {STATUS_LABELS[todo.status]}
          </span>
          {list.category && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/80 border border-secondary-bg text-secondary-dark-bg">
              {CATEGORY_LABELS[list.category] ?? list.category}
            </span>
          )}
        </div>

        <div className="space-y-3 text-sm text-secondary-dark-bg">
          {list.createdAt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>
                Created on: {dayjs(list.createdAt).format('DD/MM/YYYY')}
              </span>
            </div>
          )}
          {todo.dueDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0 text-triadic-orange" />
              <span>Due: {dayjs(todo.dueDate).format('DD/MM/YYYY')}</span>
            </div>
          )}
          {todo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{todo.location}</span>
            </div>
          )}
        </div>

        {todo.notes && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-secondary-dark-bg" />
              <span className="text-sm font-semibold text-dark-bg">Notes</span>
            </div>
            <p className="text-sm text-secondary-dark-bg leading-relaxed whitespace-pre-wrap">
              {todo.notes}
            </p>
          </div>
        )}

        {todo.image && (
          <div className="mt-6">
            <span className="text-sm font-semibold text-dark-bg block mb-2">
              Image
            </span>
            <img
              src={todo.image}
              alt="Attached"
              className="w-full max-h-64 object-contain rounded-lg border border-secondary-bg"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-secondary-bg mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-secondary-dark-bg hover:text-dark-bg transition-colors"
        >
          Close
        </button>
        <button
          onClick={() => {
            onEditTodo(todo.id, {
              status: todo.status === 'successful' ? 'pending' : 'successful',
            });
          }}
          className="px-4 py-2 text-sm font-medium bg-accent text-dark-bg rounded-lg hover:opacity-90 transition-opacity"
        >
          {todo.status === 'successful' ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button
          onClick={() => onDeleteTodo(todo.id)}
          className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function TasksPage() {
  const {
    todoLists,
    isLoading,
    isError,
    error,
    refetch,
    handleCreateList,
    handleDeleteList,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleEditTodo,
    createListMutationIsPending,
  } = useTodoListsData();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);

  function handleCreateListSubmit(name: string, opts?: CreateListOpts) {
    handleCreateList(name, opts);
    setShowCreateForm(false);
  }

  function handleSelectTodo(todo: TodoItem, list: TodoList) {
    setSelectedTask((prev) =>
      prev?.todo.id === todo.id ? null : { todo, list }
    );
  }

  function handleDeleteSelectedTodo(id: string, listId: string) {
    handleDeleteTodo(id, listId);
    setSelectedTask(null);
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
            handleToggleTodo={handleToggleTodo}
            handleDeleteTodo={handleDeleteTodo}
            handleEditTodo={handleEditTodo}
            selectedTodoId={selectedTask?.todo.id ?? null}
            onSelectTodo={handleSelectTodo}
          />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col w-1/2">
        {selectedTask ? (
          <TaskDetailPanel
            todo={selectedTask.todo}
            list={selectedTask.list}
            onClose={() => setSelectedTask(null)}
            onDeleteTodo={(id) =>
              handleDeleteSelectedTodo(id, selectedTask.list.id)
            }
            onEditTodo={(id, updates) => {
              handleEditTodo(id, selectedTask.list.id, updates);
              setSelectedTask((prev) =>
                prev ? { ...prev, todo: { ...prev.todo, ...updates } } : null
              );
            }}
          />
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
