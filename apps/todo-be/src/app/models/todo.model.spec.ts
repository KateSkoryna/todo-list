import { Todo } from './todo.model';
import { TodoItem } from '@fyltura/types';
import mongoose from 'mongoose';

describe('Todo Model', () => {
  it('should create a new todo with default status', async () => {
    const todoData = {
      name: 'Test Todo',
      todolistId: new mongoose.Types.ObjectId(),
    };
    const todo = await Todo.create(todoData);

    expect(todo).toBeDefined();
    expect(todo.name).toBe(todoData.name);
    expect(todo.status).toBe('pending');
    expect(todo.todolistId.toString()).toBe(todoData.todolistId.toString());
  });

  it('should transform to JSON correctly', async () => {
    const todoData = {
      name: 'Test Todo',
      status: 'successful',
      todolistId: new mongoose.Types.ObjectId(),
      dueDate: new Date('2026-04-01'),
      location: 'Office',
      notes: 'Some notes',
    };

    const todo = await Todo.create(todoData);

    const todoObject = todo.toJSON() as unknown as TodoItem;

    expect(todoObject.id).toBeDefined();
    expect(typeof todoObject.id).toBe('string');
    expect(todoObject.name).toBe(todoData.name);
    expect(todoObject.status).toBe('successful');
    expect(todoObject.location).toBe('Office');
    expect(todoObject.notes).toBe('Some notes');
    expect(todoObject.dueDate).toBe(todoData.dueDate.toISOString());
    expect(todoObject.todolistId.toString()).toEqual(
      todoData.todolistId.toString()
    );
  });
});
