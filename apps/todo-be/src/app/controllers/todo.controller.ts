import { Request, Response } from 'express';
import { TodoRepository } from '../repositories/todo.repository';
import { TodolistRepository } from '../repositories/todolist.repository';
import { createValidationError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth.middleware';
import { TodoStatus, UpdateTodoItem } from '@fyltura/types';
import mongoose from 'mongoose';

const VALID_STATUSES: TodoStatus[] = ['pending', 'successful', 'failed'];
const MAX_LOCATION_LENGTH = 200;
const MAX_NOTES_LENGTH = 2000;

function isValidDate(value: string): boolean {
  return !isNaN(new Date(value).getTime());
}

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
      const { name, status, dueDate, location, notes, completedAt } = req.body;
      const userId = (req as AuthRequest).userId;
      const errors = [];

      if (!todolistId || !mongoose.Types.ObjectId.isValid(todolistId)) {
        errors.push({ field: 'todolistId', value: todolistId ?? '' });
      }

      if (!name) {
        errors.push({ field: 'name', value: name });
      }

      if (status !== undefined && !VALID_STATUSES.includes(status)) {
        errors.push({ field: 'status', value: status });
      }

      if (dueDate != null && !isValidDate(dueDate)) {
        errors.push({ field: 'dueDate', value: dueDate });
      }

      if (completedAt != null && !isValidDate(completedAt)) {
        errors.push({ field: 'completedAt', value: completedAt });
      }

      if (location != null && location.length > MAX_LOCATION_LENGTH) {
        errors.push({ field: 'location', value: location });
      }

      if (notes != null && notes.length > MAX_NOTES_LENGTH) {
        errors.push({ field: 'notes', value: notes });
      }

      if (errors.length > 0) {
        return res.status(400).json(createValidationError(errors));
      }

      const todolist = await TodolistRepository.findById(todolistId, userId);
      if (!todolist) {
        return res.status(404).json({ message: 'Todolist not found' });
      }

      const newTodo = await TodoRepository.create(todolistId, {
        name,
        status,
        dueDate: dueDate ?? null,
        location: location ?? null,
        notes: notes ?? null,
        completedAt: completedAt ?? null,
      });
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
      const { name, status, dueDate, location, notes, completedAt } = req.body;
      const userId = (req as AuthRequest).userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json(createValidationError([{ field: 'id', value: id }]));
      }

      const hasFields = [
        name,
        status,
        dueDate,
        location,
        notes,
        completedAt,
      ].some((v) => v !== undefined);
      if (!hasFields) {
        return res
          .status(400)
          .json(createValidationError([{ field: '', value: '' }]));
      }

      const errors = [];

      if (status !== undefined && !VALID_STATUSES.includes(status)) {
        errors.push({ field: 'status', value: status });
      }

      if (dueDate != null && !isValidDate(dueDate)) {
        errors.push({ field: 'dueDate', value: dueDate });
      }

      if (completedAt != null && !isValidDate(completedAt)) {
        errors.push({ field: 'completedAt', value: completedAt });
      }

      if (location != null && location.length > MAX_LOCATION_LENGTH) {
        errors.push({ field: 'location', value: location });
      }

      if (notes != null && notes.length > MAX_NOTES_LENGTH) {
        errors.push({ field: 'notes', value: notes });
      }

      if (errors.length > 0) {
        return res.status(400).json(createValidationError(errors));
      }

      const todolist = await TodolistRepository.findById(todolistId, userId);
      if (!todolist) {
        return res.status(404).json({ message: 'Todolist not found' });
      }

      const updates: UpdateTodoItem = {};
      if (name !== undefined) updates.name = name;
      if (status !== undefined) updates.status = status;
      if (dueDate !== undefined) updates.dueDate = dueDate;
      if (location !== undefined) updates.location = location;
      if (notes !== undefined) updates.notes = notes;
      if (completedAt !== undefined) updates.completedAt = completedAt;

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
