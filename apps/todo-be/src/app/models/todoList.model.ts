import { Schema, model } from 'mongoose';

const todolistSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Number, required: true },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
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

todolistSchema.set('toJSON', { virtuals: true });
todolistSchema.set('toObject', { virtuals: true });

export const Todolist = model('Todolist', todolistSchema);
