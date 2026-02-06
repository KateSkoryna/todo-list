// --- TODO TYPES ---
export interface NewTodoItem {
  name: string;
  isDone: boolean;
  todolistId: string;
}

export interface TodoItem extends NewTodoItem {
  id: string;
}

export interface UpdateTodoItem {
  name?: string;
  isDone?: boolean;
}

// --- TODOLIST TYPES ---
export interface NewTodoList {
  name: string;
  userId: number;
}

export interface TodoList extends NewTodoList {
  id: string;
  todos: TodoItem[];
}

export interface UpdateTodoList {
  name?: string;
}
