import 'dotenv/config';

import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import * as path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';

import { TodolistController } from './app/controllers/todolist.controller';
import { TodoController } from './app/controllers/todo.controller';
import { AuthController } from './app/controllers/auth.controller';
import { UserController } from './app/controllers/user.controller';
import {
  authMiddleware,
  verifyFirebaseToken,
} from './app/middleware/auth.middleware';

const app = express();

// --- Database Connection ---
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;

if (!mongoUri) {
  console.error(
    'MONGODB_URI is not defined in environment variables. Please check your .env file or environment setup.'
  );
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() =>
    console.log(`Successfully connected to MongoDB to database: ${dbName}`)
  )
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Swagger Docs ---
const swaggerDocument = YAML.load(
  path.resolve(__dirname, '../../../tools/swagger.yml')
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Auth Routes ---
app.get('/api/auth/user', authMiddleware, AuthController.getUser);
app.post(
  '/api/auth/provision',
  verifyFirebaseToken,
  AuthController.provisionUser
);

// --- User Routes ---
app.get('/api/users/:userId/stats', authMiddleware, UserController.getStats);

// --- Todolist Routes ---
app.get(
  '/api/users/:userId/todolists',
  authMiddleware,
  TodolistController.getAll
);
app.post(
  '/api/users/:userId/todolists',
  authMiddleware,
  TodolistController.create
);
app.put(
  '/api/users/:userId/todolists/:todolistId',
  authMiddleware,
  TodolistController.update
);
app.delete(
  '/api/users/:userId/todolists/:todolistId',
  authMiddleware,
  TodolistController.delete
);

// --- Todo Routes ---
app.post(
  '/api/users/:userId/todolists/:todolistId/todos',
  authMiddleware,
  TodoController.create
);
app.put(
  '/api/users/:userId/todolists/:todolistId/todos/:id',
  authMiddleware,
  TodoController.update
);
app.delete(
  '/api/users/:userId/todolists/:todolistId/todos/:id',
  authMiddleware,
  TodoController.delete
);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
server.on('error', console.error);
