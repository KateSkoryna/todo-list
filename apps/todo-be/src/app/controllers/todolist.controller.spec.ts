import { TodolistController } from './todolist.controller';
import { TodolistRepository } from '../repositories/todolist.repository';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

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

describe('TodolistController', () => {
  let req: Request;
  let res: Response;
  let todolistId: string;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    todolistId = new mongoose.Types.ObjectId().toString();
    jest.clearAllMocks();
  });

  it('should get all todolists for the authenticated user', async () => {
    const todolists = [
      { id: todolistId, name: 'Test Todolist', userId: TEST_USER_ID },
    ];
    (TodolistRepository.findAll as jest.Mock).mockResolvedValue(todolists);

    await TodolistController.getAll(req, res);

    expect(TodolistRepository.findAll).toHaveBeenCalledWith(TEST_USER_ID);
    expect(res.json).toHaveBeenCalledWith(todolists);
  });

  it('should handle error when getting all todolists', async () => {
    const errorMessage = 'Database error';
    (TodolistRepository.findAll as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await TodolistController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching todolists',
      error: errorMessage,
    });
  });

  it('should get a todolist by id', async () => {
    req.params.todolistId = todolistId;
    const todolist = {
      id: todolistId,
      name: 'Test Todolist',
      userId: TEST_USER_ID,
    };
    (TodolistRepository.findById as jest.Mock).mockResolvedValue(todolist);

    await TodolistController.getById(req, res);

    expect(TodolistRepository.findById).toHaveBeenCalledWith(
      todolistId,
      TEST_USER_ID
    );
    expect(res.json).toHaveBeenCalledWith(todolist);
  });

  it('should return 404 if todolist not found by id', async () => {
    req.params.todolistId = todolistId;
    (TodolistRepository.findById as jest.Mock).mockResolvedValue(null);

    await TodolistController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todolist not found' });
  });

  it('should handle error when getting todolist by id', async () => {
    req.params.todolistId = todolistId;
    const errorMessage = 'Database error';
    (TodolistRepository.findById as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await TodolistController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching todolist',
      error: errorMessage,
    });
  });

  it('should create a new todolist', async () => {
    req.body = { name: 'New Todolist' };
    const newTodolist = {
      id: todolistId,
      name: 'New Todolist',
      userId: TEST_USER_ID,
    };
    (TodolistRepository.create as jest.Mock).mockResolvedValue(newTodolist);

    await TodolistController.create(req, res);

    expect(TodolistRepository.create).toHaveBeenCalledWith({
      name: 'New Todolist',
      userId: TEST_USER_ID,
      priority: undefined,
      category: undefined,
      dueDate: undefined,
      notes: undefined,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newTodolist);
  });

  it('should return 400 if missing name in create', async () => {
    req.body = {};
    await TodolistController.create(req, res);

    expect(TodolistRepository.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      fields: [{ field: 'name', value: '' }],
    });
  });

  it('should handle error when creating todolist', async () => {
    req.body = { name: 'New Todolist' };
    const errorMessage = 'Database error';
    (TodolistRepository.create as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await TodolistController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error creating todolist',
      error: errorMessage,
    });
  });

  it('should update a todolist', async () => {
    req.params.todolistId = todolistId;
    req.body = { name: 'Updated Name' };
    const updatedTodolist = {
      id: todolistId,
      name: 'Updated Name',
      userId: TEST_USER_ID,
    };
    (TodolistRepository.update as jest.Mock).mockResolvedValue(updatedTodolist);

    await TodolistController.update(req, res);

    expect(TodolistRepository.update).toHaveBeenCalledWith(
      todolistId,
      {
        name: 'Updated Name',
        priority: undefined,
        category: undefined,
        dueDate: undefined,
        notes: undefined,
      },
      TEST_USER_ID
    );
    expect(res.json).toHaveBeenCalledWith(updatedTodolist);
  });

  it('should return 404 if todolist not found for update', async () => {
    req.params.todolistId = todolistId;
    req.body = { name: 'Updated Name' };
    (TodolistRepository.update as jest.Mock).mockResolvedValue(null);

    await TodolistController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todolist not found' });
  });

  it('should return 400 if missing name in update', async () => {
    req.params.todolistId = todolistId;
    req.body = {};
    await TodolistController.update(req, res);

    expect(TodolistRepository.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      fields: [{ field: 'name', value: '' }],
    });
  });

  it('should handle error when updating todolist', async () => {
    req.params.todolistId = todolistId;
    req.body = { name: 'Updated Name' };
    const errorMessage = 'Database error';
    (TodolistRepository.update as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await TodolistController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error updating todolist',
      error: errorMessage,
    });
  });

  it('should delete a todolist', async () => {
    req.params.todolistId = todolistId;
    const deletedTodolist = {
      id: todolistId,
      name: 'Deleted Todolist',
      userId: TEST_USER_ID,
    };
    (TodolistRepository.delete as jest.Mock).mockResolvedValue(deletedTodolist);

    await TodolistController.delete(req, res);

    expect(TodolistRepository.delete).toHaveBeenCalledWith(
      todolistId,
      TEST_USER_ID
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 404 if todolist not found for delete', async () => {
    req.params.todolistId = todolistId;
    (TodolistRepository.delete as jest.Mock).mockResolvedValue(null);

    await TodolistController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todolist not found' });
  });

  it('should handle error when deleting todolist', async () => {
    req.params.todolistId = todolistId;
    const errorMessage = 'Database error';
    (TodolistRepository.delete as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    await TodolistController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error deleting todolist',
      error: errorMessage,
    });
  });
});
