import { Request, Response } from 'express';
import { TodolistRepository } from '../repositories/todolist.repository';

export const TodolistController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
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
      if (!name || !userId) {
        return res
          .status(400)
          .json({ message: 'Missing required fields: name, userId' });
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
      if (!name) {
        return res
          .status(400)
          .json({ message: 'Missing required field: name' });
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
