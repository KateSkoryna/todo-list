import { Request, Response } from 'express';
import { TodoRepository } from '../repositories/todo.repository';
import { createValidationError } from '../utils/errors';
import mongoose from 'mongoose';

export const TodoController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const todos = await TodoRepository.findAll();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching todos', error: (error as Error).message });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(createValidationError([{ field: 'id', value: id }]));
      }

      const todo = await TodoRepository.findById(id);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json(todo);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching todo', error: (error as Error).message });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { todolistId, name, isDone } = req.body;
      const errors = [];

      if (!todolistId) {
        errors.push({ field: 'todolistId', value: todolistId });
      } else if (!mongoose.Types.ObjectId.isValid(todolistId)) {
        errors.push({ field: 'todolistId', value: todolistId });
      }

      if (!name) {
        errors.push({ field: 'name', value: name });
      }

      if (errors.length > 0) {
        return res.status(400).json(createValidationError(errors));
      }

      const newTodo = await TodoRepository.create(todolistId, name, isDone);
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({ message: 'Error creating todo', error: (error as Error).message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, isDone } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(createValidationError([{ field: 'id', value: id }]));
      }

      if (name === undefined && isDone === undefined) {
        return res.status(400).json(createValidationError([{ field: '', value: '' }]));
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
      res.status(500).json({ message: 'Error updating todo', error: (error as Error).message });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(createValidationError([{ field: 'id', value: id }]));
      }

      const deletedTodo = await TodoRepository.delete(id);
      if (!deletedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting todo', error: (error as Error).message });
    }
  },
};
