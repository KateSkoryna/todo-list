import 'dotenv/config';

import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import * as path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';

import { TodolistController } from './app/controllers/todolist.controller';
import { TodoController } from './app/controllers/todo.controller';

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
  ) // Log the database name
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

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
server.on('error', console.error);
