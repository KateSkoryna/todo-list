import { TodoController } from './todo.controller';
import { TodoRepository } from '../repositories/todo.repository';
import { Request, Response } from 'express';
import mongoose from 'mongoose';


jest.mock('../repositories/todo.repository');

const mockRequest = () => {
  const req: Partial<Request> = {};
  req.params = {};
  req.body = {};
  req.query = {};
  return req as Request;
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


  it('should get all todos', async () => {
    const todos = [{ id: todoId, name: 'Test Todo', isDone: false, todolistId }];
    (TodoRepository.findAll as jest.Mock).mockResolvedValue(todos);

    await TodoController.getAll(req, res);

    expect(TodoRepository.findAll).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(todos);
    expect(res.status).not.toHaveBeenCalledWith(500);
  });

  it('should handle error when getting all todos', async () => {
    const errorMessage = 'Database error';
    (TodoRepository.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await TodoController.getAll(req, res);

    expect(TodoRepository.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching todos', error: errorMessage });
  });


  it('should get a todo by id', async () => {
    req.params.id = todoId;
    const todo = { id: todoId, name: 'Test Todo', isDone: false, todolistId };
    (TodoRepository.findById as jest.Mock).mockResolvedValue(todo);

    await TodoController.getById(req, res);

    expect(TodoRepository.findById).toHaveBeenCalledWith(todoId);
    expect(res.json).toHaveBeenCalledWith(todo);
    expect(res.status).not.toHaveBeenCalledWith(404);
  });

  it('should return 404 if todo not found by id', async () => {
    req.params.id = todoId;
    (TodoRepository.findById as jest.Mock).mockResolvedValue(null);

    await TodoController.getById(req, res);

    expect(TodoRepository.findById).toHaveBeenCalledWith(todoId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
  });

  it('should handle error when getting todo by id', async () => {
    req.params.id = todoId;
    const errorMessage = 'Database error';
    (TodoRepository.findById as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await TodoController.getById(req, res);

    expect(TodoRepository.findById).toHaveBeenCalledWith(todoId);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching todo', error: errorMessage });
  });


  it('should create a new todo', async () => {
    req.body = { name: 'New Todo', todolistId };
    const newTodo = { id: todoId, name: 'New Todo', isDone: false, todolistId };
    (TodoRepository.create as jest.Mock).mockResolvedValue(newTodo);

    await TodoController.create(req, res);

    expect(TodoRepository.create).toHaveBeenCalledWith(todolistId, 'New Todo', undefined);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newTodo);
  });

  it('should return 400 if missing name in create', async () => {
    req.body = { todolistId };
    await TodoController.create(req, res);

    expect(TodoRepository.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      fields: [{ field: 'name', value: '' }]
    });
  });

  it('should return 400 if missing todolistId in create', async () => {
    req.body = { name: 'New Todo' };
    await TodoController.create(req, res);

    expect(TodoRepository.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      fields: [{ field: 'todolistId', value: '' }]
    });
  });

  it('should handle error when creating todo', async () => {
    req.body = { name: 'New Todo', todolistId };
    const errorMessage = 'Database error';
    (TodoRepository.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await TodoController.create(req, res);

    expect(TodoRepository.create).toHaveBeenCalledWith(todolistId, 'New Todo', undefined);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error creating todo', error: errorMessage });
  });


  it('should update a todo', async () => {
    req.params.id = todoId;
    req.body = { name: 'Updated Name', isDone: true };
    const updatedTodo = { id: todoId, name: 'Updated Name', isDone: true, todolistId };
    (TodoRepository.update as jest.Mock).mockResolvedValue(updatedTodo);

    await TodoController.update(req, res);

    expect(TodoRepository.update).toHaveBeenCalledWith(todoId, { name: 'Updated Name', isDone: true });
    expect(res.json).toHaveBeenCalledWith(updatedTodo);
  });

  it('should return 404 if todo not found for update', async () => {
    req.params.id = todoId;
    req.body = { name: 'Updated Name' };
    (TodoRepository.update as jest.Mock).mockResolvedValue(null);

    await TodoController.update(req, res);

    expect(TodoRepository.update).toHaveBeenCalledWith(todoId, { name: 'Updated Name' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
  });

  it('should return 400 if no fields provided for update', async () => {
    req.params.id = todoId;
    req.body = {};
    await TodoController.update(req, res);

    expect(TodoRepository.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      fields: [{ field: '', value: '' }]
    });
  });

  it('should handle error when updating todo', async () => {
    req.params.id = todoId;
    req.body = { name: 'Updated Name' };
    const errorMessage = 'Database error';
    (TodoRepository.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await TodoController.update(req, res);

    expect(TodoRepository.update).toHaveBeenCalledWith(todoId, { name: 'Updated Name' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error updating todo', error: errorMessage });
  });


  it('should delete a todo', async () => {
    req.params.id = todoId;
    const deletedTodo = { id: todoId, name: 'Deleted Todo', isDone: false, todolistId };
    (TodoRepository.delete as jest.Mock).mockResolvedValue(deletedTodo);

    await TodoController.delete(req, res);

    expect(TodoRepository.delete).toHaveBeenCalledWith(todoId);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 404 if todo not found for delete', async () => {
    req.params.id = todoId;
    (TodoRepository.delete as jest.Mock).mockResolvedValue(null);

    await TodoController.delete(req, res);

    expect(TodoRepository.delete).toHaveBeenCalledWith(todoId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todo not found' });
  });

  it('should handle error when deleting todo', async () => {
    req.params.id = todoId;
    const errorMessage = 'Database error';
    (TodoRepository.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await TodoController.delete(req, res);

    expect(TodoRepository.delete).toHaveBeenCalledWith(todoId);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting todo', error: errorMessage });
  });
});
