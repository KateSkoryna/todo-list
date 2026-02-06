import { Schema, model, Document, Types } from 'mongoose';
import { TodoList, TodoItem } from '@fyltura/types'; // Correct import name and alias

interface ITodolistDocument extends Omit<TodoList, 'id'>, Document {
  _id: Types.ObjectId;
  userId: number;
}

const todolistSchema = new Schema<ITodolistDocument>(
  {
    name: { type: String, required: true },
    userId: { type: Number, required: true },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_, ret: ITodolistDocument) => {
        const todolist: TodoList = {
          id: ret._id.toString(),
          name: ret.name,
          userId: ret.userId,
          todos: (ret.todos as TodoItem[]) || [],
        };
        return todolist;
      },
    },
    toObject: { virtuals: true },
  }
);

todolistSchema.virtual('todos', {
  ref: 'Todo',
  localField: '_id',
  foreignField: 'todolistId',
});

export const Todolist = model<ITodolistDocument>('Todolist', todolistSchema);
