import { Schema, model } from 'mongoose';

const todoSchema = new Schema(
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
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Todo = model('Todo', todoSchema);
