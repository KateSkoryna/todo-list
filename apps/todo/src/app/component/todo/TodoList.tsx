import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import {
  TodoList as TodoListType,
  TodoItem as TodoItemType,
  UpdateTodoItem,
} from '@shared/types';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import Text from '../elements/Text';
import {
  PRIORITY_COLORS,
  CATEGORY_LABELS,
} from '../../constants/todolist.constants';
import dayjs from 'dayjs';

type NewTodoOpts = {
  dueDate?: string;
  location?: string;
  notes?: string;
};

interface TodoListProps {
  todoList: TodoListType;
  onAddTodo: (todolistId: string, name: string, opts?: NewTodoOpts) => void;
  onToggleTodo: (id: string, todolistId: string) => void;
  onDeleteTodo: (id: string, todolistId: string) => void;
  onDeleteList: (id: string) => void;
  onEditTodo: (id: string, todolistId: string, updates: UpdateTodoItem) => void;
  selectedTodoId?: string | null;
  onSelectTodo?: (todo: TodoItemType) => void;
  dataTestId?: string;
}

function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = dayjs(iso);
  return d.isValid() ? d.format('MMM D, YYYY') : null;
}

function TodoList({
  todoList,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onDeleteList,
  onEditTodo,
  selectedTodoId,
  onSelectTodo,
  dataTestId,
}: TodoListProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const completedCount = todoList.todos.filter(
    (t) => t.status === 'successful'
  ).length;
  const formattedDate = formatDate(todoList.dueDate);

  function handleAddTodo(name: string, opts?: NewTodoOpts) {
    onAddTodo(todoList.id, name, opts);
    setShowAddForm(false);
  }

  return (
    <div
      className="bg-white rounded-xl border border-secondary-bg overflow-hidden"
      data-testid={dataTestId}
    >
      {/* List header */}
      <div className="px-4 py-3 bg-dark-bg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="text-accent hover:text-white transition-colors shrink-0"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            <div className="flex flex-col min-w-0 flex-1 gap-4">
              <div className="flex items-center gap-4">
                <h3
                  className="text-white font-bold truncate"
                  data-testid="todolist-title"
                >
                  {todoList.name}
                </h3>
                <span className="text-white text-xs shrink-0">
                  {completedCount}/{todoList.todos.length}
                </span>
              </div>

              {(todoList.priority || todoList.category) && (
                <div className="flex items-center gap-4 text-xs text-white/80">
                  {todoList.priority && (
                    <span>
                      Priority:{' '}
                      <span
                        className={`font-medium ${
                          todoList.priority === 'high'
                            ? 'text-triadic-orange'
                            : todoList.priority === 'medium'
                            ? 'text-triadic-blue'
                            : 'text-triadic-purple'
                        }`}
                      >
                        {todoList.priority.charAt(0).toUpperCase() +
                          todoList.priority.slice(1)}
                      </span>
                    </span>
                  )}
                  {todoList.category && (
                    <span>
                      Category:{' '}
                      <span className="text-triadic-blue font-medium">
                        {CATEGORY_LABELS[todoList.category] ??
                          todoList.category}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 shrink-0 ml-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (!isExpanded) setIsExpanded(true);
                  setShowAddForm((v) => !v);
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-dark-bg bg-accent rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3 h-3" />
                Add Task
              </button>
              <button
                onClick={() => onDeleteList(todoList.id)}
                className="p-1.5 text-white/60 hover:text-red-400 transition-colors rounded"
                aria-label="Delete list"
                data-testid="todolist-item-delete-button"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {formattedDate && (
              <span className="text-xs text-white pr-1.5">
                Due: {formattedDate}
              </span>
            )}
          </div>
        </div>

        {todoList.notes && (
          <p className="mt-1.5 ml-7 text-xs text-white/50 truncate">
            {todoList.notes}
          </p>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 space-y-3 bg-base-bg">
          {showAddForm && (
            <div className="bg-white rounded-lg p-4 border border-secondary-bg">
              <TodoForm onAddTodo={handleAddTodo} />
            </div>
          )}

          {todoList.todos.length === 0 && !showAddForm ? (
            <Text
              as="p"
              className="text-center text-secondary-dark-bg py-6 text-sm"
              dataTestId="empty-todos-message"
            >
              No tasks yet. Click{' '}
              <button
                onClick={() => setShowAddForm(true)}
                className="font-semibold text-triadic-orange hover:underline focus:outline-none"
              >
                Add Task
              </button>{' '}
              to get started!
            </Text>
          ) : (
            todoList.todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                listPriority={todoList.priority}
                isSelected={selectedTodoId === todo.id}
                onToggle={(id) => onToggleTodo(id, todoList.id)}
                onDelete={(id) => onDeleteTodo(id, todoList.id)}
                onEdit={(id, updates) => onEditTodo(id, todoList.id, updates)}
                onSelect={onSelectTodo ? () => onSelectTodo(todo) : undefined}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TodoList;
