import request from 'supertest';
import app from '../test-app';
import mongoose from 'mongoose';
import { Todo } from '../models/todo.model';
import { Todolist } from '../models/todoList.model';
import { TodoList } from '@fyltura/types';

describe('API Integration Tests', () => {
  let todolistId: string;
  let todoId: string;

  beforeEach(async () => {
    const todolist = await Todolist.create({
      name: 'Test Todolist',
      userId: 123,
    });
    todolistId = todolist._id.toString();
  });

  // --- Todolist API Tests ---
  describe('Todolist API', () => {
    it('should create a new todolist', async () => {
      const newTodolistData = { name: 'My New List', userId: 456 };
      const res = await request(app)
        .post('/api/todolists')
        .send(newTodolistData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(newTodolistData.name);
      expect(res.body.userId).toBe(newTodolistData.userId);

      const dbTodolist = await Todolist.findById(res.body.id);
      expect(dbTodolist).toBeDefined();
      expect(dbTodolist?.name).toBe(newTodolistData.name);
    });

    it('should return 400 if missing name or userId for creating todolist', async () => {
      let res = await request(app).post('/api/todolists').send({ userId: 1 });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Missing required fields: name, userId');

      res = await request(app).post('/api/todolists').send({ name: 'Test' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Missing required fields: name, userId');
    });

    it('should get all todolists', async () => {
      await Todolist.create({ name: 'Another List', userId: 123 });
      const res = await request(app).get('/api/todolists');

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2); // Includes the beforeEach todolist
      expect(res.body[0]).toHaveProperty('id');
      expect(
        res.body.some((list: TodoList) => list.name === 'Test Todolist')
      ).toBeTruthy();
      expect(
        res.body.some((list: TodoList) => list.name === 'Another List')
      ).toBeTruthy();
    });

    it('should get all todolists filtered by userId', async () => {
      await Todolist.create({ name: 'User 999 List 1', userId: 999 });
      await Todolist.create({ name: 'User 999 List 2', userId: 999 });

      const res = await request(app).get('/api/todolists?userId=999');

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].userId).toBe(999);
      expect(res.body[1].userId).toBe(999);
      expect(
        res.body.some((list: TodoList) => list.name === 'User 999 List 1')
      ).toBeTruthy();
    });

    it('should get a todolist by id', async () => {
      const res = await request(app).get(`/api/todolists/${todolistId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toBe(todolistId);
      expect(res.body.name).toBe('Test Todolist');
    });

    it('should return 404 for non-existent todolist id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/todolists/${nonExistentId}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Todolist not found');
    });

    it('should update a todolist', async () => {
      const updatedName = 'Updated Test Todolist';
      const res = await request(app)
        .put(`/api/todolists/${todolistId}`)
        .send({ name: updatedName });

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe(updatedName);

      const dbTodolist = await Todolist.findById(todolistId);
      expect(dbTodolist?.name).toBe(updatedName);
    });

    it('should return 404 if todolist not found for update', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .put(`/api/todolists/${nonExistentId}`)
        .send({ name: 'Non Existent' });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Todolist not found');
    });

    it('should return 400 if missing name for updating todolist', async () => {
      const res = await request(app)
        .put(`/api/todolists/${todolistId}`)
        .send({}); // Missing name

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Missing required field: name');
    });

    it('should delete a todolist', async () => {
      const res = await request(app).delete(`/api/todolists/${todolistId}`);

      expect(res.statusCode).toEqual(204);

      const dbTodolist = await Todolist.findById(todolistId);
      expect(dbTodolist).toBeNull();
    });

    it('should return 404 if todolist not found for delete', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).delete(`/api/todolists/${nonExistentId}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Todolist not found');
    });
  });

  // --- Todo API Tests ---
  describe('Todo API', () => {
    beforeEach(async () => {
      const todo = await Todo.create({
        name: 'Initial Todo',
        todolistId: new mongoose.Types.ObjectId(todolistId),
        isDone: false,
      });
      todoId = todo._id.toString();
    });

    it('should create a new todo', async () => {
      const newTodoData = { name: 'Buy groceries', todolistId };
      const res = await request(app).post('/api/todos').send(newTodoData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(newTodoData.name);
      expect(res.body.todolistId).toBe(newTodoData.todolistId);
      expect(res.body.isDone).toBe(false);

      const dbTodo = await Todo.findById(res.body.id);
      expect(dbTodo).toBeDefined();
      expect(dbTodo?.name).toBe(newTodoData.name);
    });

    it('should return 400 if missing name or todolistId for creating todo', async () => {
      let res = await request(app).post('/api/todos').send({ todolistId });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe(
        'Missing required fields: todolistId, name'
      );

      res = await request(app).post('/api/todos').send({ name: 'Test' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe(
        'Missing required fields: todolistId, name'
      );
    });

    it('should get all todos', async () => {
      await Todo.create({
        name: 'Another Todo',
        todolistId: new mongoose.Types.ObjectId(todolistId),
      });
      const res = await request(app).get('/api/todos');

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThanOrEqual(2); // Includes the beforeEach todo
      expect(
        res.body.some((todo: TodoList) => todo.name === 'Initial Todo')
      ).toBeTruthy();
      expect(
        res.body.some((todo: TodoList) => todo.name === 'Another Todo')
      ).toBeTruthy();
    });

    it('should get a todo by id', async () => {
      const res = await request(app).get(`/api/todos/${todoId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toBe(todoId);
      expect(res.body.name).toBe('Initial Todo');
    });

    it('should return 404 for non-existent todo id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/todos/${nonExistentId}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Todo not found');
    });

    it('should update a todo', async () => {
      const updatedName = 'Updated Initial Todo';
      const updatedIsDone = true;
      const res = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({ name: updatedName, isDone: updatedIsDone });

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe(updatedName);
      expect(res.body.isDone).toBe(updatedIsDone);

      const dbTodo = await Todo.findById(todoId);
      expect(dbTodo?.name).toBe(updatedName);
      expect(dbTodo?.isDone).toBe(updatedIsDone);
    });

    it('should return 404 if todo not found for update', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .put(`/api/todos/${nonExistentId}`)
        .send({ name: 'Non Existent' });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Todo not found');
    });

    it('should return 400 if no fields provided for update', async () => {
      const res = await request(app).put(`/api/todos/${todoId}`).send({}); // No fields to update

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('No fields provided for update');
    });

    it('should delete a todo', async () => {
      const res = await request(app).delete(`/api/todos/${todoId}`);

      expect(res.statusCode).toEqual(204);

      const dbTodo = await Todo.findById(todoId);
      expect(dbTodo).toBeNull();
    });

    it('should return 404 if todo not found for delete', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).delete(`/api/todos/${nonExistentId}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Todo not found');
    });
  });

  // --- Todolist and Todo Interaction Tests ---
  describe('Todolist and Todo Interactions', () => {
    it('should populate todos when fetching a todolist', async () => {
      const newTodolist = await Todolist.create({
        name: 'List with Todos',
        userId: 789,
      });
      await Todo.create({ name: 'Task 1', todolistId: newTodolist._id });
      await Todo.create({ name: 'Task 2', todolistId: newTodolist._id });

      const res = await request(app).get(
        `/api/todolists/${newTodolist._id.toString()}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('List with Todos');
      expect(res.body.todos).toBeDefined();
      expect(res.body.todos.length).toBe(2);
      expect(res.body.todos[0].name).toBe('Task 1');
      expect(res.body.todos[1].name).toBe('Task 2');
    });
  });
});
