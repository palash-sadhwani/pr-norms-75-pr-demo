import express from 'express';
import type { TaskService } from './services/task-service.js';
import { createTaskRouter } from './routes/task-routes.js';

export function createApp(tasks: TaskService) {
  const app = express();

  app.use(express.json());
  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });
  app.use('/tasks', createTaskRouter(tasks));

  return app;
}
