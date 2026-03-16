import { Todolist } from '../models/todoList.model';
import {
  TodoList,
  TodoListPriority,
  TodoListCategory,
  UpdateTodoList,
} from '@shared/types';

type CreateTodoListData = {
  name: string;
  userId: string;
  priority?: TodoListPriority;
  category?: TodoListCategory;
  dueDate?: string | null;
  notes?: string | null;
};

export const TodolistRepository = {
  findAll: async (userId: string): Promise<TodoList[]> => {
    const docs = await Todolist.find({ userId }).populate('todos');
    return docs.map((doc) => doc.toJSON()) as TodoList[];
  },

  findById: async (id: string, userId: string): Promise<TodoList | null> => {
    const doc = await Todolist.findOne({ _id: id, userId }).populate('todos');
    if (!doc) {
      return null;
    }
    return doc.toJSON() as TodoList;
  },

  create: async (data: CreateTodoListData): Promise<TodoList> => {
    const doc = await Todolist.create(data);
    return doc.toJSON() as TodoList;
  },

  update: async (
    id: string,
    updates: UpdateTodoList,
    userId: string
  ): Promise<TodoList | null> => {
    const doc = await Todolist.findOneAndUpdate({ _id: id, userId }, updates, {
      new: true,
    }).exec();
    if (!doc) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (doc as any).toJSON() as TodoList;
  },

  delete: async (id: string, userId: string): Promise<TodoList | null> => {
    const doc = await Todolist.findOneAndDelete({ _id: id, userId }).exec();
    if (!doc) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (doc as any).toJSON() as TodoList;
  },
};
