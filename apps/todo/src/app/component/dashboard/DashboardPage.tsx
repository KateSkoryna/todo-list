import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTodoListsQuery } from '../../fetchers/api';
import { TodoItem, TodoList } from '@shared/types';
import {
  PRIORITY_COLORS,
  CATEGORY_LABELS,
} from '../../constants/todolist.constants';

function relativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

function DonutChart({
  value,
  total,
  color,
  label,
}: {
  value: number;
  total: number;
  color: string;
  label: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const data = [{ value: pct }, { value: 100 - pct }];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={42}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={color} />
              <Cell fill="#c6c6c6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-triadic-blue">
          {pct}%
        </span>
      </div>
      <span className="text-xs text-secondary-dark-bg">{label}</span>
    </div>
  );
}

function TodayTodosPanel({ todoLists }: { todoLists: TodoList[] }) {
  return (
    <div className="bg-white rounded-xl border border-secondary-bg p-5 space-y-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark-bg">Today's Tasks</h3>
        <span className="text-xs text-secondary-dark-bg">
          Pending & upcoming
        </span>
      </div>

      {todoLists.length === 0 ? (
        <p className="text-secondary-dark-bg text-sm">
          No pending tasks for today.
        </p>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-96">
          {todoLists.map((list) => {
            const pendingTodos = list.todos
              .filter((t) => t.status === 'pending')
              .slice(0, 3);
            return (
              <div
                key={list.id}
                className="p-3 rounded-lg border border-secondary-bg space-y-2"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-dark-bg text-sm">
                    {list.name}
                  </span>
                  {list.priority && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        PRIORITY_COLORS[list.priority]
                      }`}
                    >
                      {list.priority}
                    </span>
                  )}
                  {list.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-secondary-dark-bg">
                      {CATEGORY_LABELS[list.category] ?? list.category}
                    </span>
                  )}
                </div>
                <ul className="space-y-1">
                  {pendingTodos.map((todo) => (
                    <li
                      key={todo.id}
                      className="flex items-center gap-2 text-xs text-dark-bg"
                    >
                      <span className="w-2 h-2 rounded-full bg-triadic-blue shrink-0" />
                      {todo.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TaskStatusPanel({
  successful,
  pending,
  failed,
  total,
}: {
  successful: number;
  pending: number;
  failed: number;
  total: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-secondary-bg p-5">
      <h3 className="font-semibold text-dark-bg mb-4">Task Status</h3>
      <div className="flex justify-around">
        <DonutChart
          value={successful}
          total={total}
          color="#DCF763"
          label="Completed"
        />
        <DonutChart
          value={pending}
          total={total}
          color="#4aabeb"
          label="In Progress"
        />
        <DonutChart
          value={failed}
          total={total}
          color="#eb8a4a"
          label="Failed"
        />
      </div>
    </div>
  );
}

function CompletedTasksPanel({
  todos,
  todoLists,
}: {
  todos: TodoItem[];
  todoLists: TodoList[];
}) {
  const listMap = useMemo(
    () => Object.fromEntries(todoLists.map((l) => [l.id, l.name])),
    [todoLists]
  );

  return (
    <div className="bg-white rounded-xl border border-secondary-bg p-5">
      <h3 className="font-semibold text-dark-bg mb-4">Completed Tasks</h3>
      {todos.length === 0 ? (
        <p className="text-secondary-dark-bg text-sm">
          No completed tasks yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark-bg truncate">
                  {todo.name}
                </p>
                <p className="text-xs text-secondary-dark-bg">
                  {listMap[todo.todolistId] ?? ''} ·{' '}
                  {relativeDate(todo.completedAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: todoLists = [] } = useTodoListsQuery();

  const todayStr = new Date().toISOString().slice(0, 10);

  const allTodos = useMemo(
    () => todoLists.flatMap((l) => l.todos),
    [todoLists]
  );

  const todayLists = useMemo(
    () =>
      todoLists.filter((list) =>
        list.todos.some(
          (t) =>
            t.status === 'pending' &&
            (!t.dueDate || t.dueDate.startsWith(todayStr))
        )
      ),
    [todoLists, todayStr]
  );

  const successful = useMemo(
    () => allTodos.filter((t) => t.status === 'successful').length,
    [allTodos]
  );
  const pending = useMemo(
    () => allTodos.filter((t) => t.status === 'pending').length,
    [allTodos]
  );
  const failed = useMemo(
    () => allTodos.filter((t) => t.status === 'failed').length,
    [allTodos]
  );

  const recentCompleted = useMemo(
    () =>
      allTodos
        .filter((t) => t.status === 'successful')
        .sort((a, b) =>
          (b.completedAt ?? '').localeCompare(a.completedAt ?? '')
        )
        .slice(0, 5),
    [allTodos]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-dark-bg">
        Welcome back, {user?.firstName} 👋
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayTodosPanel todoLists={todayLists} />
        <div className="space-y-6">
          <TaskStatusPanel
            successful={successful}
            pending={pending}
            failed={failed}
            total={allTodos.length}
          />
          <CompletedTasksPanel todos={recentCompleted} todoLists={todoLists} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
