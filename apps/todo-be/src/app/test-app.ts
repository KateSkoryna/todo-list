import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { TodolistController } from './controllers/todolist.controller';
import { TodoController } from './controllers/todo.controller';
import { AuthRequest } from './middleware/auth.middleware';

export const TEST_USER_ID = '507f1f77bcf86cd799439011';

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Inject test userId so controllers can read req.userId without a real JWT
app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as AuthRequest).userId = TEST_USER_ID;
  (req as AuthRequest).userEmail = 'test@example.com';
  next();
});

// --- API Routes ---
app.post('/api/users/me/todolists', TodolistController.create);
app.get('/api/users/me/todolists', TodolistController.getAll);
app.get('/api/users/me/todolists/:todolistId', TodolistController.getById);
app.put('/api/users/me/todolists/:todolistId', TodolistController.update);
app.delete('/api/users/me/todolists/:todolistId', TodolistController.delete);

app.post('/api/users/me/todolists/:todolistId/todos', TodoController.create);
app.get(
  '/api/users/me/todolists/:todolistId/todos/:id',
  TodoController.getById
);
app.put('/api/users/me/todolists/:todolistId/todos/:id', TodoController.update);
app.delete(
  '/api/users/me/todolists/:todolistId/todos/:id',
  TodoController.delete
);

export default app;
