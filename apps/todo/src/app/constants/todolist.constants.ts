import { TodoListPriority, TodoListCategory } from '@shared/types';

export type SortKey = 'name' | 'priority' | 'dueDate' | 'category';

export const PRIORITY_OPTIONS: { value: TodoListPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const CATEGORY_OPTIONS: { value: TodoListCategory; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'education', label: 'Education' },
  { value: 'work', label: 'Work' },
  { value: 'family', label: 'Family' },
  { value: 'health', label: 'Health' },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'priority', label: 'Priority' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'category', label: 'Category' },
];

export const PRIORITY_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-700 border border-red-300',
  medium: 'bg-amber-100 text-amber-700 border border-amber-300',
  low: 'bg-green-100 text-green-700 border border-green-300',
};

export const CATEGORY_LABELS: Record<string, string> = {
  home: 'Home',
  education: 'Education',
  work: 'Work',
  family: 'Family',
  health: 'Health',
};
