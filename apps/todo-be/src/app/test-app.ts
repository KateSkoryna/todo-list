import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { TodolistController } from './controllers/todolist.controller';
import { TodoController } from './controllers/todo.controller';
import { AuthRequest } from './middleware/auth.middleware';

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Inject test userId so controllers can read req.userId without a real JWT
app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as AuthRequest).userId = '1';
  (req as AuthRequest).userEmail = 'test@example.com';
  next();
});

// --- API Routes ---
app.post('/api/todolists', TodolistController.create);
app.post('/api/todos', TodoController.create);
app.get('/api/todolists', TodolistController.getAll);
app.get('/api/todolists/:id', TodolistController.getById);
app.put('/api/todolists/:id', TodolistController.update);
app.delete('/api/todolists/:id', TodolistController.delete);

app.get('/api/todos', TodoController.getAll);
app.get('/api/todos/:id', TodoController.getById);
app.put('/api/todos/:id', TodoController.update);
app.delete('/api/todos/:id', TodoController.delete);

export default app;
