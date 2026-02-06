import { Todo } from './todo.model';
import { TodoItem } from '@fyltura/types';
import mongoose from 'mongoose';

describe('Todo Model', () => {
  it('should create a new todo successfully', async () => {
    const todoData = {
      name: 'Test Todo',
      todolistId: new mongoose.Types.ObjectId(),
    };
    const todo = await Todo.create(todoData);

    expect(todo).toBeDefined();
    expect(todo.name).toBe(todoData.name);
    expect(todo.isDone).toBe(false);
    expect(todo.todolistId.toString()).toBe(todoData.todolistId.toString());
  });

  it('should transform to JSON correctly', async () => {
    const todoData = {
      name: 'Test Todo',
      isDone: true,
      todolistId: new mongoose.Types.ObjectId(),
    };

    const todo = await Todo.create(todoData);

    const todoObject = todo.toJSON() as unknown as TodoItem;

    expect(todoObject.id).toBeDefined();
    expect(typeof todoObject.id).toBe('string');
    expect(todoObject.name).toBe(todoData.name);
    expect(todoObject.isDone).toBe(todoData.isDone);

    expect(todoObject.todolistId.toString()).toEqual(
      todoData.todolistId.toString()
    );
  });
});
