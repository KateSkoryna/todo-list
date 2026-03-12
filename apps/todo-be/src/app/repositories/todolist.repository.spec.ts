import { TodolistRepository } from './todolist.repository';
import { Todolist } from '../models/todoList.model';
import { Todo } from '../models/todo.model';
import mongoose from 'mongoose';
import { TodoList } from '@fyltura/types';

const USER1_ID = '507f1f77bcf86cd799439011';
const USER2_ID = '507f1f77bcf86cd799439012';

describe('TodolistRepository', () => {
  it('should create a new todolist', async () => {
    const todolist = await TodolistRepository.create('New Todolist', USER1_ID);
    expect(todolist).toBeDefined();
    expect(todolist.name).toBe('New Todolist');
    expect(todolist.userId).toBe(USER1_ID);

    const foundTodolist = await Todolist.findById(todolist.id);
    expect(foundTodolist).toBeDefined();
  });

  it('should find all todolists for user 1', async () => {
    await TodolistRepository.create('Todolist 1', USER1_ID);
    await TodolistRepository.create('Todolist 2', USER1_ID);

    const todolists = await TodolistRepository.findAll(USER1_ID);
    expect(todolists.length).toBe(2);
    expect(todolists[0].name).toBe('Todolist 1');
    expect(todolists[1].name).toBe('Todolist 2');
  });

  it('should find all todolists by userId', async () => {
    await TodolistRepository.create('User 1 Todolist 1', USER1_ID);
    await TodolistRepository.create('User 1 Todolist 2', USER1_ID);
    await TodolistRepository.create('User 2 Todolist 1', USER2_ID);

    const todolists = await TodolistRepository.findAll(USER1_ID);
    expect(todolists.length).toBe(2);
    expect(todolists[0].name).toBe('User 1 Todolist 1');
  });

  it('should find a todolist by id', async () => {
    const todolist = await TodolistRepository.create('Find Me', USER1_ID);
    const foundTodolist = await TodolistRepository.findById(
      todolist.id,
      USER1_ID
    );
    expect(foundTodolist).toBeDefined();
    expect(foundTodolist?.name).toBe('Find Me');
  });

  it('should find a todolist by id with userId ownership check', async () => {
    const todolist = await TodolistRepository.create('Find Me', USER1_ID);
    const found = await TodolistRepository.findById(todolist.id, USER1_ID);
    expect(found).toBeDefined();
    expect(found?.name).toBe('Find Me');

    const notFound = await TodolistRepository.findById(todolist.id, USER2_ID);
    expect(notFound).toBeNull();
  });

  it('should return null if todolist not found by id', async () => {
    const foundTodolist = await TodolistRepository.findById(
      new mongoose.Types.ObjectId().toString(),
      USER1_ID
    );
    expect(foundTodolist).toBeNull();
  });

  it('should update a todolist', async () => {
    const todolist = await TodolistRepository.create('Old Name', USER1_ID);
    await TodolistRepository.update(todolist.id, 'Updated Name', USER1_ID);

    const foundTodolist = await Todolist.findById(todolist.id);
    expect(foundTodolist).toBeDefined();
    expect(foundTodolist?.name).toBe('Updated Name');
  });

  it('should return null if todolist not found for update', async () => {
    const updatedTodolist = await TodolistRepository.update(
      new mongoose.Types.ObjectId().toString(),
      'Non Existent',
      USER1_ID
    );
    expect(updatedTodolist).toBeNull();
  });

  it('should return null if update attempted by wrong user', async () => {
    const todolist = await TodolistRepository.create(
      'Owned by User 1',
      USER1_ID
    );
    const result = await TodolistRepository.update(
      todolist.id,
      'Hacked',
      USER2_ID
    );
    expect(result).toBeNull();
  });

  it('should delete a todolist', async () => {
    const todolist = await TodolistRepository.create('Delete Me', USER1_ID);
    await TodolistRepository.delete(todolist.id, USER1_ID);

    const foundTodolist = await Todolist.findById(todolist.id);
    expect(foundTodolist).toBeNull();
  });

  it('should return null if todolist not found for delete', async () => {
    const deletedTodolist = await TodolistRepository.delete(
      new mongoose.Types.ObjectId().toString(),
      USER1_ID
    );
    expect(deletedTodolist).toBeNull();
  });

  it('should return null if delete attempted by wrong user', async () => {
    const todolist = await TodolistRepository.create(
      'Owned by User 1',
      USER1_ID
    );
    const result = await TodolistRepository.delete(todolist.id, USER2_ID);
    expect(result).toBeNull();
  });

  it('should populate todos when finding a todolist', async () => {
    const todolist = await TodolistRepository.create('Populate Test', USER1_ID);
    await Todo.create({
      name: 'Todo 1',
      todolistId: todolist.id,
    });
    await Todo.create({
      name: 'Todo 2',
      todolistId: todolist.id,
    });

    const foundTodolist: TodoList = await TodolistRepository.findById(
      todolist.id,
      USER1_ID
    );
    expect(foundTodolist?.todos).toBeDefined();
    expect(foundTodolist?.todos.length).toBe(2);
    expect(foundTodolist?.todos[0].name).toBe('Todo 1');
    expect(foundTodolist?.todos[1].name).toBe('Todo 2');
    expect(foundTodolist?.todos[0].id).toBeDefined();
  });
});
