import { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { PieChart, Pie, Cell } from 'recharts';
import { ClipboardList, CheckSquare, Plus } from 'lucide-react';
import { useTodoListsQuery } from '../../fetchers/api';
import { TodoItem, TodoList } from '@shared/types';
import { useDateStore } from '../../store/dateStore';
import TodoCard from '../elements/TodoCard';

// ─── helpers ────────────────────────────────────────────────────────────────

function toDateStr(d: Dayjs): string {
  return d.format('YYYY-MM-DD');
}

function isToday(d: Dayjs): boolean {
  return d.isSame(dayjs(), 'day');
}

function relativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const diff = dayjs().diff(dayjs(dateStr), 'day');
  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

// ─── flat item type ──────────────────────────────────────────────────────────

export interface FlatItem extends TodoItem {
  listPriority: TodoList['priority'];
  listCreatedAt: TodoList['createdAt'];
}

function flattenLists(lists: TodoList[]): FlatItem[] {
  return lists.flatMap((list) =>
    list.todos.map((todo) => ({
      ...todo,
      listPriority: list.priority,
      listCreatedAt: list.createdAt,
    }))
  );
}

// ─── donut chart ─────────────────────────────────────────────────────────────

function DonutChart({
  value,
  total,
  color,
  dotColor,
  label,
}: {
  value: number;
  total: number;
  color: string;
  dotColor: string;
  label: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const data = [{ value: pct }, { value: 100 - pct }];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <PieChart width={112} height={112}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={36}
            outerRadius={50}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
        <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-dark-bg">
          {pct}%
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: dotColor }}
        />
        <span className="text-xs text-secondary-dark-bg">{label}</span>
      </div>
    </div>
  );
}

// ─── completed card ───────────────────────────────────────────────────────────

function CompletedCard({ item }: { item: FlatItem }) {
  return (
    <div className="rounded-xl border border-secondary-bg bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-green-500 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="font-semibold text-dark-bg leading-snug">{item.name}</p>
          {item.notes && (
            <p className="text-sm text-secondary-dark-bg line-clamp-2 mt-1">
              {item.notes}
            </p>
          )}
          <p className="text-xs mt-2 text-secondary-dark-bg">
            Status:{' '}
            <span className="font-medium text-green-500">Completed</span>
          </p>
          {item.completedAt && (
            <p className="text-xs text-secondary-dark-bg">
              {relativeDate(item.completedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── panels ──────────────────────────────────────────────────────────────────

function TodoPanel({
  items,
  selectedDate,
}: {
  items: FlatItem[];
  selectedDate: Dayjs;
}) {
  const dayLabel = selectedDate.format('D MMMM');

  return (
    <div className="bg-white rounded-xl border border-secondary-bg p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-triadic-orange">
          <ClipboardList className="w-5 h-5" />
          <h3 className="font-bold text-lg">To-Do</h3>
        </div>
        <button className="flex items-center gap-1 text-sm text-secondary-dark-bg hover:text-triadic-orange transition-colors">
          <Plus className="w-4 h-4" />
          Add task
        </button>
      </div>

      <p className="text-sm text-secondary-dark-bg mb-4 flex items-center gap-1.5">
        {dayLabel}
        {isToday(selectedDate) && (
          <>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-triadic-orange" />
            Today
          </>
        )}
      </p>

      {items.length === 0 ? (
        <p className="text-secondary-dark-bg text-sm flex-1">
          No tasks for this day.
        </p>
      ) : (
        <div className="space-y-3 overflow-y-auto flex-1">
          {items.map((item) => (
            <TodoCard key={item.id} item={item} />
          ))}
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
      <div className="flex items-center gap-2 text-triadic-orange mb-5">
        <ClipboardList className="w-5 h-5" />
        <h3 className="font-bold text-lg">Task Status</h3>
      </div>
      <div className="flex justify-around">
        <DonutChart
          value={successful}
          total={total}
          color="#22c55e"
          dotColor="#22c55e"
          label="Completed"
        />
        <DonutChart
          value={pending}
          total={total}
          color="#4aabeb"
          dotColor="#4aabeb"
          label="In Progress"
        />
        <DonutChart
          value={failed}
          total={total}
          color="#eb4a4a"
          dotColor="#eb4a4a"
          label="Not Started"
        />
      </div>
    </div>
  );
}

function CompletedPanel({ items }: { items: FlatItem[] }) {
  return (
    <div className="bg-white rounded-xl border border-secondary-bg p-5">
      <div className="flex items-center gap-2 text-triadic-orange mb-4">
        <CheckSquare className="w-5 h-5" />
        <h3 className="font-bold text-lg">Completed Task</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-secondary-dark-bg text-sm">
          No completed tasks yet.
        </p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {items.map((item) => (
            <CompletedCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

function DashboardPage() {
  const { data: todoLists = [] } = useTodoListsQuery();
  const selectedDate = useDateStore((s) => s.selectedDate);
  const selectedDateStr = toDateStr(selectedDate);

  const allItems = useMemo(() => flattenLists(todoLists), [todoLists]);

  const dateItems = useMemo(
    () =>
      allItems.filter((item) =>
        item.dueDate
          ? item.dueDate.startsWith(selectedDateStr)
          : isToday(selectedDate)
      ),
    [allItems, selectedDateStr, selectedDate]
  );

  const todoItems = useMemo(
    () => dateItems.filter((item) => item.status !== 'successful'),
    [dateItems]
  );

  const successful = useMemo(
    () => dateItems.filter((t) => t.status === 'successful').length,
    [dateItems]
  );
  const pending = useMemo(
    () => dateItems.filter((t) => t.status === 'pending').length,
    [dateItems]
  );
  const failed = useMemo(
    () => dateItems.filter((t) => t.status === 'failed').length,
    [dateItems]
  );

  const completedItems = useMemo(
    () =>
      dateItems
        .filter((t) => t.status === 'successful')
        .sort((a, b) =>
          (b.completedAt ?? '').localeCompare(a.completedAt ?? '')
        )
        .slice(0, 5),
    [dateItems]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <TodoPanel items={todoItems} selectedDate={selectedDate} />

      <div className="space-y-6">
        <TaskStatusPanel
          successful={successful}
          pending={pending}
          failed={failed}
          total={allItems.length}
        />
        <CompletedPanel items={completedItems} />
      </div>
    </div>
  );
}

export default DashboardPage;
