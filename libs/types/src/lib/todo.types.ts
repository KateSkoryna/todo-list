// --- TODO TYPES ---
export type TodoStatus = 'pending' | 'successful' | 'failed';

export interface NewTodoItem {
  name: string;
  status?: TodoStatus;
  todolistId: string;
  dueDate?: string | null;
  location?: string | null;
  notes?: string | null;
  completedAt?: string | null;
}

export interface TodoItem extends NewTodoItem {
  id: string;
  status: TodoStatus;
}

export interface UpdateTodoItem {
  name?: string;
  status?: TodoStatus;
  dueDate?: string | null;
  location?: string | null;
  notes?: string | null;
  completedAt?: string | null;
}

// --- TODOLIST TYPES ---
export interface NewTodoList {
  name: string;
  userId: string;
}

export interface TodoList extends NewTodoList {
  id: string;
  todos: TodoItem[];
}

export interface UpdateTodoList {
  name?: string;
}
