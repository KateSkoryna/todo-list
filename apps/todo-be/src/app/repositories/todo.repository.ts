import { Todo } from '../models/todo.model';
import { NewTodoItem, TodoItem, UpdateTodoItem } from '@fyltura/types';

export const TodoRepository = {
  findById: async (id: string): Promise<TodoItem | null> => {
    const doc = await Todo.findById(id);
    if (!doc) {
      return null;
    }
    return doc.toJSON() as TodoItem;
  },

  create: async (
    todolistId: string,
    newTodo: Omit<NewTodoItem, 'id' | 'todolistId'>
  ): Promise<TodoItem> => {
    const doc = await Todo.create({ todolistId, ...newTodo });
    return doc.toJSON() as TodoItem;
  },

  update: async (
    id: string,
    updatedTodo: UpdateTodoItem
  ): Promise<TodoItem | null> => {
    const doc = await Todo.findByIdAndUpdate(id, updatedTodo, {
      new: true,
    }).exec();
    if (!doc) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (doc as any).toJSON() as TodoItem;
  },

  delete: async (id: string): Promise<TodoItem | null> => {
    const doc = await Todo.findByIdAndDelete(id).exec();
    if (!doc) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (doc as any).toJSON() as TodoItem;
  },
};
