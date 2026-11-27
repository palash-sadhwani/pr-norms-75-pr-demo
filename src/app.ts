import express from 'express';
import type { TaskService } from './services/task-service.js';
import { createTaskRouter } from './routes/task-routes.js';
import { errorHandler, NotFoundError } from './middleware/error-handler.js';
import { requestIdMiddleware } from './middleware/request-id.js';
import { openApiDocument } from './openapi.js';

export function createApp(tasks: TaskService) {
  const app = express();

  app.use(requestIdMiddleware);
  app.use(express.json({ limit: '32kb' }));
  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });
  app.get('/openapi.json', (_request, response) => {
    response.status(200).json(openApiDocument);
  });
  app.use('/tasks', createTaskRouter(tasks));
  app.use((_request, _response, next) => {
    next(new NotFoundError('Route not found'));
  });
  app.use(errorHandler);

  return app;
}
