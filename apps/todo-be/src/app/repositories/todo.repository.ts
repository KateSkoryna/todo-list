import { Types } from 'mongoose';
import { Todo } from '../models/todo.model';
import {
  NewTodoItem,
  TodoItem,
  UpdateTodoItem,
  UserStats,
  StatsPeriod,
} from '@fyltura/types';

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

  getStats: async (userId: string, period: StatsPeriod): Promise<UserStats> => {
    const periodStart = new Date();
    if (period === 'day') periodStart.setDate(periodStart.getDate() - 1);
    else if (period === 'week') periodStart.setDate(periodStart.getDate() - 7);
    else if (period === 'month')
      periodStart.setMonth(periodStart.getMonth() - 1);
    else periodStart.setFullYear(periodStart.getFullYear() - 1);

    const results = await Todo.aggregate([
      {
        $lookup: {
          from: 'todolists',
          localField: 'todolistId',
          foreignField: '_id',
          as: 'todolist',
        },
      },
      { $unwind: '$todolist' },
      {
        $match: {
          'todolist.userId': new Types.ObjectId(userId),
          createdAt: { $gte: periodStart },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const counts: Record<string, number> = {
      pending: 0,
      successful: 0,
      failed: 0,
    };
    for (const r of results) {
      counts[r._id] = r.count;
    }

    const total = counts.pending + counts.successful + counts.failed;
    const completed = counts.successful + counts.failed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      successful: counts.successful,
      failed: counts.failed,
      pending: counts.pending,
      completionRate,
    };
  },
};
