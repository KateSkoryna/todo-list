import { Todo } from '../models/todo.model';

export const TodoRepository = {
  findAll: async () => {
    return await Todo.find();
  },

  findById: async (id: string) => {
    return await Todo.findById(id);
  },

  create: async (todolistId: string, name: string, isDone: boolean = false) => {
    return await Todo.create({ todolistId, name, isDone });
  },

  update: async (id: string, name: string, isDone: boolean) => {
    return await Todo.findByIdAndUpdate(id, { name, isDone }, { new: true });
  },

  delete: async (id: string) => {
    return await Todo.findByIdAndDelete(id);
  },
};
