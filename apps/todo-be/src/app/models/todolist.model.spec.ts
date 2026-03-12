import { Todolist } from './todoList.model';
import { TodoList } from '@fyltura/types';
import mongoose from 'mongoose';

const userId = new mongoose.Types.ObjectId();

describe('Todolist Model', () => {
  it('should create a new todolist successfully', async () => {
    const todolistData = {
      name: 'Test Todolist',
      userId,
    };
    const todolist = await Todolist.create(todolistData);
    expect(todolist).toBeDefined();
    expect(todolist.name).toBe(todolistData.name);
    expect(todolist.userId.toString()).toBe(userId.toString());
  });

  it('should require a name', async () => {
    const todolistData = {
      userId,
    };

    await expect(Todolist.create(todolistData)).rejects.toThrow(
      'Todolist validation failed: name: Path `name` is required.'
    );
  });

  it('should require a userId', async () => {
    const todolistData = {
      name: 'Test Todolist',
    };
    await expect(Todolist.create(todolistData)).rejects.toThrow(
      'Todolist validation failed: userId: Path `userId` is required.'
    );
  });

  it('should transform to JSON correctly', async () => {
    const todolistData = {
      name: 'Test Todolist',
      userId,
    };
    const todolist = await Todolist.create(todolistData);

    const todolistObject = todolist.toJSON() as unknown as TodoList;

    expect(todolistObject.id).toBeDefined();
    expect(typeof todolistObject.id).toBe('string');
    expect(todolistObject.name).toBe(todolistData.name);
    expect(todolistObject.userId).toBe(userId.toString());
  });
});
