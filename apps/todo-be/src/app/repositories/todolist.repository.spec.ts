import { TodolistRepository } from './todolist.repository';
import { Todolist } from '../models/todoList.model';
import { Todo } from '../models/todo.model';
import mongoose from 'mongoose';
import { TodoList } from '@fyltura/types';

describe('TodolistRepository', () => {
  it('should create a new todolist', async () => {
    const todolist = await TodolistRepository.create('New Todolist', 1);
    expect(todolist).toBeDefined();
    expect(todolist.name).toBe('New Todolist');
    expect(todolist.userId).toBe(1);

    const foundTodolist = await Todolist.findById(todolist.id);
    expect(foundTodolist).toBeDefined();
  });

  it('should find all todolists for user 1', async () => {
    await TodolistRepository.create('Todolist 1', 1);
    await TodolistRepository.create('Todolist 2', 1);

    const todolists = await TodolistRepository.findAll(1);
    expect(todolists.length).toBe(2);
    expect(todolists[0].name).toBe('Todolist 1');
    expect(todolists[1].name).toBe('Todolist 2');
  });

  it('should find all todolists by userId', async () => {
    await TodolistRepository.create('User 1 Todolist 1', 1);
    await TodolistRepository.create('User 1 Todolist 2', 1);
    await TodolistRepository.create('User 2 Todolist 1', 2);

    const todolists = await TodolistRepository.findAll(1);
    expect(todolists.length).toBe(2);
    expect(todolists[0].name).toBe('User 1 Todolist 1');
  });

  it('should find a todolist by id', async () => {
    const todolist = await TodolistRepository.create('Find Me', 1);
    const foundTodolist = await TodolistRepository.findById(todolist.id);
    expect(foundTodolist).toBeDefined();
    expect(foundTodolist?.name).toBe('Find Me');
  });

  it('should return null if todolist not found by id', async () => {
    const foundTodolist = await TodolistRepository.findById(
      new mongoose.Types.ObjectId().toString()
    );
    expect(foundTodolist).toBeNull();
  });

  it('should update a todolist', async () => {
    const todolist = await TodolistRepository.create('Old Name', 1);
    await TodolistRepository.update(todolist.id, 'Updated Name');

    const foundTodolist = await Todolist.findById(todolist.id);
    expect(foundTodolist).toBeDefined();
    expect(foundTodolist?.name).toBe('Updated Name');
  });

  it('should return null if todolist not found for update', async () => {
    const updatedTodolist = await TodolistRepository.update(
      new mongoose.Types.ObjectId().toString(),
      'Non Existent'
    );
    expect(updatedTodolist).toBeNull();
  });

  it('should delete a todolist', async () => {
    const todolist = await TodolistRepository.create('Delete Me', 1);
    await TodolistRepository.delete(todolist.id);

    const foundTodolist = await Todolist.findById(todolist.id);
    expect(foundTodolist).toBeNull();
  });

  it('should return null if todolist not found for delete', async () => {
    const deletedTodolist = await TodolistRepository.delete(
      new mongoose.Types.ObjectId().toString()
    );
    expect(deletedTodolist).toBeNull();
  });

  it('should populate todos when finding a todolist', async () => {
    const todolist = await TodolistRepository.create('Populate Test', 1);
    await Todo.create({
      name: 'Todo 1',
      todolistId: todolist.id,
    });
    await Todo.create({
      name: 'Todo 2',
      todolistId: todolist.id,
    });

    const foundTodolist: TodoList = await TodolistRepository.findById(todolist.id);
    expect(foundTodolist?.todos).toBeDefined();
    expect(foundTodolist?.todos.length).toBe(2);
    expect(foundTodolist?.todos[0].name).toBe('Todo 1');
    expect(foundTodolist?.todos[1].name).toBe('Todo 2');
    expect(foundTodolist?.todos[0].id).toBeDefined();
  });
});
