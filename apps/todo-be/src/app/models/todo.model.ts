import { Schema, model, Document, Types } from 'mongoose';
import { TodoItem } from '@fyltura/types';

interface ITodoDocument extends Omit<TodoItem, 'id' | 'todolistId'>, Document {
    _id: Types.ObjectId;
    todolistId: Types.ObjectId;
}

const todoSchema = new Schema<ITodoDocument>(
  {
    name: { type: String, required: true },
    isDone: { type: Boolean, default: false },
    todolistId: {
      type: Schema.Types.ObjectId,
      ref: 'Todolist',
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_, ret: ITodoDocument) => {
        const todoItem: TodoItem = {
          id: ret._id.toString(),
          name: ret.name,
          isDone: ret.isDone,
          todolistId: ret.todolistId.toString(),
        };
        return todoItem;
      },
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

export const Todo = model<ITodoDocument>('Todo', todoSchema);