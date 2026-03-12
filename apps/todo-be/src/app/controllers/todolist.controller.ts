import { Request, Response } from 'express';
import { TodolistRepository } from '../repositories/todolist.repository';
import { createValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

export const TodolistController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const userId = (req as AuthRequest).userId;
      const lists = await TodolistRepository.findAll(userId);
      res.json(lists);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching todolists',
        error: (error as Error).message,
      });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const { todolistId } = req.params;
      const userId = (req as AuthRequest).userId;

      if (!mongoose.Types.ObjectId.isValid(todolistId)) {
        return res
          .status(400)
          .json(createValidationError([{ field: 'id', value: todolistId }]));
      }

      const list = await TodolistRepository.findById(todolistId, userId);
      if (!list) {
        return res.status(404).json({ message: 'Todolist not found' });
      }
      res.json(list);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching todolist',
        error: (error as Error).message,
      });
    }
  },

  create: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const userId = (req as AuthRequest).userId;

      if (!name) {
        return res
          .status(400)
          .json(createValidationError([{ field: 'name', value: name }]));
      }

      const newList = await TodolistRepository.create(name, userId);
      res.status(201).json(newList);
    } catch (error) {
      res.status(500).json({
        message: 'Error creating todolist',
        error: (error as Error).message,
      });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { todolistId } = req.params;
      const { name } = req.body;
      const userId = (req as AuthRequest).userId;

      if (!mongoose.Types.ObjectId.isValid(todolistId)) {
        return res
          .status(400)
          .json(createValidationError([{ field: 'id', value: todolistId }]));
      }

      if (!name) {
        return res
          .status(400)
          .json(createValidationError([{ field: 'name', value: name }]));
      }

      const updatedList = await TodolistRepository.update(
        todolistId,
        name,
        userId
      );
      if (!updatedList) {
        return res.status(404).json({ message: 'Todolist not found' });
      }
      res.json(updatedList);
    } catch (error) {
      res.status(500).json({
        message: 'Error updating todolist',
        error: (error as Error).message,
      });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { todolistId } = req.params;
      const userId = (req as AuthRequest).userId;

      if (!mongoose.Types.ObjectId.isValid(todolistId)) {
        return res
          .status(400)
          .json(createValidationError([{ field: 'id', value: todolistId }]));
      }

      const deletedList = await TodolistRepository.delete(todolistId, userId);
      if (!deletedList) {
        return res.status(404).json({ message: 'Todolist not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting todolist',
        error: (error as Error).message,
      });
    }
  },
};
