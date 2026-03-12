import { TodoController } from './todo.controller';
import { TodoRepository } from '../repositories/todo.repository';
import { TodolistRepository } from '../repositories/todolist.repository';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

jest.mock('../repositories/todo.repository');
jest.mock('../repositories/todolist.repository');

const TEST_USER_ID = '507f1f77bcf86cd799439011';

const mockRequest = (userId = TEST_USER_ID) => {
  const req = {
    params: {},
    body: {},
    query: {},
    userId,
    userEmail: 'test@example.com',
  } as unknown as AuthRequest;
  return req as unknown as Request;
};

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnThis();
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

describe('TodoController', () => {
  let req: Request;
  let res: Response;
  let todoId: string;
  let todolistId: string;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    todoId = new mongoose.Types.ObjectId().toString();
    todolistId = new mongoose.Types.ObjectId().toString();

    jest.clearAllMocks();
  });

  it('should get a todo by id', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    const todo = { id: todoId, name: 'Test Todo', isDone: false, todolistId };
    (TodolistRepository.findById as jest.Mock).mockResolvedValue({
      id: todolistId,
    });
    (TodoRepository.findById as jest.Mock).mockResolvedValue(todo);

    await TodoController.getById(req, res);

    expect(TodolistRepository.findById).toHaveBeenCalledWith(
      todolistId,
      TEST_USER_ID
    );
    expect(TodoRepository.findById).toHaveBeenCalledWith(todoId);
    expect(res.json).toHaveBeenCalledWith(todo);
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it('should return 404 if todolist not found when getting todo by id', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    (TodolistRepository.findById as jest.Mock).mockResolvedValue(null);

    await TodoController.getById(req, res);

    expect(TodoRepository.findById).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todolist not found' });
  });

  it('should return 404 if todo not found by id', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    (TodolistRepository.findById as jest.Mock).mockResolvedValue({
      id: todolistId,
    });
    (TodoRepository.findById as jest.Mock).mockResolvedValue(null);

    await TodoController.getById(req, res);

    expect(TodoRepository.findById).toHaveBeenCalledWith(todoId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
  });

  it('should handle error when getting todo by id', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    const errorMessage = 'Database error';
    (TodolistRepository.findById as jest.Mock).mockResolvedValue({
      id: todolistId,
    });
    (TodoRepository.findById as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await TodoController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching todo',
      error: errorMessage,
    });
  });

  it('should create a new todo', async () => {
    req.params.todolistId = todolistId;
    req.body = { name: 'New Todo' };
    const newTodo = { id: todoId, name: 'New Todo', isDone: false, todolistId };
    (TodolistRepository.findById as jest.Mock).mockResolvedValue({
      id: todolistId,
    });
    (TodoRepository.create as jest.Mock).mockResolvedValue(newTodo);

    await TodoController.create(req, res);

    expect(TodolistRepository.findById).toHaveBeenCalledWith(
      todolistId,
      TEST_USER_ID
    );
    expect(TodoRepository.create).toHaveBeenCalledWith(
      todolistId,
      'New Todo',
      undefined
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newTodo);
  });

  it('should return 400 if missing name in create', async () => {
    req.params.todolistId = todolistId;
    req.body = {};
    await TodoController.create(req, res);

    expect(TodoRepository.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      fields: [{ field: 'name', value: '' }],
    });
  });

  it('should return 404 if todolist not found when creating todo', async () => {
    req.params.todolistId = todolistId;
    req.body = { name: 'New Todo' };
    (TodolistRepository.findById as jest.Mock).mockResolvedValue(null);

    await TodoController.create(req, res);

    expect(TodoRepository.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todolist not found' });
  });

  it('should handle error when creating todo', async () => {
    req.params.todolistId = todolistId;
    req.body = { name: 'New Todo' };
    const errorMessage = 'Database error';
    (TodolistRepository.findById as jest.Mock).mockResolvedValue({
      id: todolistId,
    });
    (TodoRepository.create as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await TodoController.create(req, res);

    expect(TodoRepository.create).toHaveBeenCalledWith(
      todolistId,
      'New Todo',
      undefined
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error creating todo',
      error: errorMessage,
    });
  });

  it('should update a todo', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    req.body = { name: 'Updated Name', isDone: true };
    const updatedTodo = {
      id: todoId,
      name: 'Updated Name',
      isDone: true,
      todolistId,
    };
    (TodolistRepository.findById as jest.Mock).mockResolvedValue({
      id: todolistId,
    });
    (TodoRepository.update as jest.Mock).mockResolvedValue(updatedTodo);

    await TodoController.update(req, res);

    expect(TodolistRepository.findById).toHaveBeenCalledWith(
      todolistId,
      TEST_USER_ID
    );
    expect(TodoRepository.update).toHaveBeenCalledWith(todoId, {
      name: 'Updated Name',
      isDone: true,
    });
    expect(res.json).toHaveBeenCalledWith(updatedTodo);
  });

  it('should return 404 if todolist not found for update', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    req.body = { name: 'Updated Name' };
    (TodolistRepository.findById as jest.Mock).mockResolvedValue(null);

    await TodoController.update(req, res);

    expect(TodoRepository.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todolist not found' });
  });

  it('should return 404 if todo not found for update', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    req.body = { name: 'Updated Name' };
    (TodolistRepository.findById as jest.Mock).mockResolvedValue({
      id: todolistId,
    });
    (TodoRepository.update as jest.Mock).mockResolvedValue(null);

    await TodoController.update(req, res);

    expect(TodoRepository.update).toHaveBeenCalledWith(todoId, {
      name: 'Updated Name',
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
  });

  it('should return 400 if no fields provided for update', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    req.body = {};
    await TodoController.update(req, res);

    expect(TodoRepository.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      fields: [{ field: '', value: '' }],
    });
  });

  it('should handle error when updating todo', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    req.body = { name: 'Updated Name' };
    const errorMessage = 'Database error';
    (TodolistRepository.findById as jest.Mock).mockResolvedValue({
      id: todolistId,
    });
    (TodoRepository.update as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await TodoController.update(req, res);

    expect(TodoRepository.update).toHaveBeenCalledWith(todoId, {
      name: 'Updated Name',
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error updating todo',
      error: errorMessage,
    });
  });

  it('should delete a todo', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    const deletedTodo = {
      id: todoId,
      name: 'Deleted Todo',
      isDone: false,
      todolistId,
    };
    (TodolistRepository.findById as jest.Mock).mockResolvedValue({
      id: todolistId,
    });
    (TodoRepository.delete as jest.Mock).mockResolvedValue(deletedTodo);

    await TodoController.delete(req, res);

    expect(TodolistRepository.findById).toHaveBeenCalledWith(
      todolistId,
      TEST_USER_ID
    );
    expect(TodoRepository.delete).toHaveBeenCalledWith(todoId);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 404 if todolist not found for delete', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    (TodolistRepository.findById as jest.Mock).mockResolvedValue(null);

    await TodoController.delete(req, res);

    expect(TodoRepository.delete).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todolist not found' });
  });

  it('should return 404 if todo not found for delete', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    (TodolistRepository.findById as jest.Mock).mockResolvedValue({
      id: todolistId,
    });
    (TodoRepository.delete as jest.Mock).mockResolvedValue(null);

    await TodoController.delete(req, res);

    expect(TodoRepository.delete).toHaveBeenCalledWith(todoId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
  });

  it('should handle error when deleting todo', async () => {
    req.params.todolistId = todolistId;
    req.params.id = todoId;
    const errorMessage = 'Database error';
    (TodolistRepository.findById as jest.Mock).mockResolvedValue({
      id: todolistId,
    });
    (TodoRepository.delete as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await TodoController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error deleting todo',
      error: errorMessage,
    });
  });
});
