import { Todolist } from '../models/todoList.model';

export const TodolistRepository = {
  findAll: async (userId?: number) => {
    const query = userId ? { userId } : {};
    return await Todolist.find(query).populate('todos');
  },

  findById: async (id: string) => {
    return await Todolist.findById(id).populate('todos');
  },

  create: async (name: string, userId: number) => {
    return await Todolist.create({ name, userId });
  },

  update: async (id: string, name: string) => {
    return await Todolist.findByIdAndUpdate(id, { name }, { new: true });
  },

  delete: async (id: string) => {
    return await Todolist.findByIdAndDelete(id);
  },
};
