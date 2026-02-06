import { Request, Response } from 'express';
import { TodoRepository } from '../repositories/todo.repository';

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
      if (!todolistId || !name) {
        return res.status(400).json({ message: 'Missing required fields: todolistId, name' });
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
      // Partial update check: at least one field should be present for update
      if (name === undefined && isDone === undefined) {
        return res.status(400).json({ message: 'No fields provided for update' });
      }
      const updatedTodo = await TodoRepository.update(id, name, isDone);
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
