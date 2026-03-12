import { Request, Response } from 'express';
import { TodoRepository } from '../repositories/todo.repository';
import { TodolistRepository } from '../repositories/todolist.repository';
import { createValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

export const TodoController = {
  getById: async (req: Request, res: Response) => {
    try {
      const { todolistId, id } = req.params;
      const userId = (req as AuthRequest).userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json(createValidationError([{ field: 'id', value: id }]));
      }

      const todolist = await TodolistRepository.findById(todolistId, userId);
      if (!todolist) {
        return res.status(404).json({ message: 'Todolist not found' });
      }

      const todo = await TodoRepository.findById(id);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json(todo);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching todo',
        error: (error as Error).message,
      });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { todolistId } = req.params;
      const { name, isDone } = req.body;
      const userId = (req as AuthRequest).userId;
      const errors = [];

      if (!todolistId || !mongoose.Types.ObjectId.isValid(todolistId)) {
        errors.push({ field: 'todolistId', value: todolistId ?? '' });
      }

      if (!name) {
        errors.push({ field: 'name', value: name });
      }

      if (errors.length > 0) {
        return res.status(400).json(createValidationError(errors));
      }

      const todolist = await TodolistRepository.findById(todolistId, userId);
      if (!todolist) {
        return res.status(404).json({ message: 'Todolist not found' });
      }

      const newTodo = await TodoRepository.create(todolistId, name, isDone);
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({
        message: 'Error creating todo',
        error: (error as Error).message,
      });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { todolistId, id } = req.params;
      const { name, isDone } = req.body;
      const userId = (req as AuthRequest).userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json(createValidationError([{ field: 'id', value: id }]));
      }

      if (name === undefined && isDone === undefined) {
        return res
          .status(400)
          .json(createValidationError([{ field: '', value: '' }]));
      }

      const todolist = await TodolistRepository.findById(todolistId, userId);
      if (!todolist) {
        return res.status(404).json({ message: 'Todolist not found' });
      }

      const updates: { name?: string; isDone?: boolean } = {};
      if (name !== undefined) updates.name = name;
      if (isDone !== undefined) updates.isDone = isDone;

      const updatedTodo = await TodoRepository.update(id, updates);
      if (!updatedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json(updatedTodo);
    } catch (error) {
      res.status(500).json({
        message: 'Error updating todo',
        error: (error as Error).message,
      });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { todolistId, id } = req.params;
      const userId = (req as AuthRequest).userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json(createValidationError([{ field: 'id', value: id }]));
      }

      const todolist = await TodolistRepository.findById(todolistId, userId);
      if (!todolist) {
        return res.status(404).json({ message: 'Todolist not found' });
      }

      const deletedTodo = await TodoRepository.delete(id);
      if (!deletedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting todo',
        error: (error as Error).message,
      });
    }
  },
};
