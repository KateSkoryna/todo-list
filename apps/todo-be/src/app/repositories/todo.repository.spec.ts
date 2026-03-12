import { TodoRepository } from './todo.repository';
import { Todo } from '../models/todo.model';
import { Todolist } from '../models/todoList.model';
import mongoose from 'mongoose';

const USER_ID = '507f1f77bcf86cd799439011';

describe('TodoRepository', () => {
  let todolistId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const todolist = await Todolist.create({
      name: 'Test Todolist',
      userId: USER_ID,
    });
    todolistId = todolist._id;
  });

  it('should create a new todo with default status', async () => {
    const todo = await TodoRepository.create(todolistId.toString(), {
      name: 'New Todo',
    });
    expect(todo).toBeDefined();
    expect(todo.name).toBe('New Todo');
    expect(todo.status).toBe('pending');
    expect(todo.todolistId).toBe(todolistId.toString());

    const foundTodo = await Todo.findById(todo.id);
    expect(foundTodo).toBeDefined();
  });

  it('should create a todo with extended fields', async () => {
    const todo = await TodoRepository.create(todolistId.toString(), {
      name: 'Extended Todo',
      status: 'successful',
      location: 'Home',
      notes: 'Test notes',
      dueDate: '2026-04-01T00:00:00.000Z',
    });
    expect(todo.status).toBe('successful');
    expect(todo.location).toBe('Home');
    expect(todo.notes).toBe('Test notes');
    expect(todo.dueDate).toBe('2026-04-01T00:00:00.000Z');
  });

  it('should find a todo by id', async () => {
    const todo = await TodoRepository.create(todolistId.toString(), {
      name: 'Find Me',
    });
    const foundTodo = await TodoRepository.findById(todo.id);
    expect(foundTodo).toBeDefined();
    expect(foundTodo?.name).toBe('Find Me');
  });

  it('should return null if todo not found by id', async () => {
    const foundTodo = await TodoRepository.findById(
      new mongoose.Types.ObjectId().toString()
    );
    expect(foundTodo).toBeNull();
  });

  it('should update a todo', async () => {
    const todo = await TodoRepository.create(todolistId.toString(), {
      name: 'Old Name',
    });
    await TodoRepository.update(todo.id, {
      name: 'Updated Name',
      status: 'failed',
      location: 'Library',
    });

    const foundTodo = await Todo.findById(todo.id);
    expect(foundTodo).toBeDefined();
    expect(foundTodo?.name).toBe('Updated Name');
    expect(foundTodo?.status).toBe('failed');
    expect(foundTodo?.location).toBe('Library');
  });

  it('should return null if todo not found for update', async () => {
    const updatedTodo = await TodoRepository.update(
      new mongoose.Types.ObjectId().toString(),
      { name: 'Non Existent', status: 'pending' }
    );
    expect(updatedTodo).toBeNull();
  });

  it('should delete a todo', async () => {
    const todo = await TodoRepository.create(todolistId.toString(), {
      name: 'Delete Me',
    });
    await TodoRepository.delete(todo.id);

    const foundTodo = await Todo.findById(todo.id);
    expect(foundTodo).toBeNull();
  });

  it('should return null if todo not found for delete', async () => {
    const deletedTodo = await TodoRepository.delete(
      new mongoose.Types.ObjectId().toString()
    );
    expect(deletedTodo).toBeNull();
  });
});
