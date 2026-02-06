import { Todo } from '../models/todo.model';
import { TodoItem } from '@fyltura/types';

export const TodoRepository = {
  findAll: async (): Promise<TodoItem[]> => {
    const docs = await Todo.find();
    return docs.map(doc => doc.toJSON()) as TodoItem[];
  },

  findById: async (id: string): Promise<TodoItem | null> => {
    const doc = await Todo.findById(id);
    if (!doc) {
      return null;
    }
    return doc.toJSON() as TodoItem;
  },

  create: async (todolistId: string, name: string, isDone: boolean = false): Promise<TodoItem> => {
    const doc = await Todo.create({ todolistId, name, isDone });
    return doc.toJSON() as TodoItem;
  },

  update: async (id: string, updates: { name?: string; isDone?: boolean }): Promise<TodoItem | null> => {
    const doc = await Todo.findByIdAndUpdate(id, updates, { new: true }).exec();
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
