import { Todolist } from '../models/todoList.model';
import { TodoList } from '@fyltura/types';

export const TodolistRepository = {
  findAll: async (userId?: number): Promise<TodoList[]> => {
    const query = userId ? { userId } : {};
    const docs = await Todolist.find(query).populate('todos');
    return docs.map(doc => doc.toJSON()) as TodoList[];
  },

  findById: async (id: string): Promise<TodoList | null> => {
    const doc = await Todolist.findById(id).populate('todos');
    if (!doc) {
      return null;
    }
    return doc.toJSON() as TodoList;
  },

  create: async (name: string, userId: number) => {
    return await Todolist.create({ name, userId });
  },

  update: async (id: string, name: string): Promise<TodoList | null> => {
    const doc = await Todolist.findByIdAndUpdate(id, { name }, { new: true });
    if (!doc) {
      return null;
    }
    return doc.toJSON() as TodoList;
  },

  delete: async (id: string) => {
    return await Todolist.findByIdAndDelete(id);
  },
};
