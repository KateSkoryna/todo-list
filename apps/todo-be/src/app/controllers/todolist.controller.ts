import { Request, Response } from 'express';
import { TodolistRepository } from '../repositories/todolist.repository';
import { createValidationError } from '../utils/errors';
import mongoose from 'mongoose';

export const TodolistController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const userIdParam = req.query.userId;

      if (!userIdParam) {
        return res.status(400).json(createValidationError([{ field: 'userId', value: userIdParam }]));
      }

      const userId = Number(userIdParam);

      if (isNaN(userId)) {
        return res.status(400).json(createValidationError([{ field: 'userId', value: userIdParam }]));
      }

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
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(createValidationError([{ field: 'id', value: id }]));
      }

      const list = await TodolistRepository.findById(id);
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
      const { name, userId } = req.body;
      const errors = [];

      if (!name) {
        errors.push({ field: 'name', value: name });
      }
      if (!userId) {
        errors.push({ field: 'userId', value: userId });
      }

      if (errors.length > 0) {
        return res.status(400).json(createValidationError(errors));
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
      const { id } = req.params;
      const { name } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(createValidationError([{ field: 'id', value: id }]));
      }

      if (!name) {
        return res.status(400).json(createValidationError([{ field: 'name', value: name }]));
      }

      const updatedList = await TodolistRepository.update(id, name);
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
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(createValidationError([{ field: 'id', value: id }]));
      }

      const deletedList = await TodolistRepository.delete(id);
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
