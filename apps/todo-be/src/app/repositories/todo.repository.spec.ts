import { TodoRepository } from './todo.repository';
import { Todo } from '../models/todo.model';
import { Todolist } from '../models/todoList.model';
import mongoose from 'mongoose';

describe('TodoRepository', () => {
  let todolistId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const todolist = await Todolist.create({
      name: 'Test Todolist',
      userId: 1,
    });
    todolistId = todolist._id;
  });

  it('should create a new todo', async () => {
    const todo = await TodoRepository.create(todolistId.toString(), 'New Todo');
    expect(todo).toBeDefined();
    expect(todo.name).toBe('New Todo');
    expect(todo.isDone).toBe(false);
    expect(todo.todolistId.toString()).toBe(todolistId.toString());

    const foundTodo = await Todo.findById(todo._id);
    expect(foundTodo).toBeDefined();
  });

  it('should find all todos', async () => {
    await TodoRepository.create(todolistId.toString(), 'Todo 1');
    await TodoRepository.create(todolistId.toString(), 'Todo 2');

    const todos = await TodoRepository.findAll();
    expect(todos.length).toBe(2);
    expect(todos[0].name).toBe('Todo 1');
    expect(todos[1].name).toBe('Todo 2');
  });

  it('should find a todo by id', async () => {
    const todo = await TodoRepository.create(todolistId.toString(), 'Find Me');
    const foundTodo = await TodoRepository.findById(todo._id.toString());
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
    const todo = await TodoRepository.create(
      todolistId.toString(),
      'Old Name',
      false
    );
    await TodoRepository.update(todo._id.toString(), 'Updated Name', true);

    const foundTodo = await Todo.findById(todo._id);
    expect(foundTodo).toBeDefined();
    expect(foundTodo?.name).toBe('Updated Name');
    expect(foundTodo?.isDone).toBe(true);
  });

  it('should return null if todo not found for update', async () => {
    const updatedTodo = await TodoRepository.update(
      new mongoose.Types.ObjectId().toString(),
      'Non Existent',
      false
    );
    expect(updatedTodo).toBeNull();
  });

  it('should delete a todo', async () => {
    const todo = await TodoRepository.create(
      todolistId.toString(),
      'Delete Me'
    );
    await TodoRepository.delete(todo._id.toString());

    const foundTodo = await Todo.findById(todo._id);
    expect(foundTodo).toBeNull();
  });

  it('should return null if todo not found for delete', async () => {
    const deletedTodo = await TodoRepository.delete(
      new mongoose.Types.ObjectId().toString()
    );
    expect(deletedTodo).toBeNull();
  });
});
