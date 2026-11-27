import { Router } from 'express';
import type { Request, Response } from 'express';
import type { TaskService } from '../services/task-service.js';
import { parseTaskId, validateCreateTask, validateUpdateTask } from '../validation/task-validation.js';
import { NotFoundError } from '../middleware/error-handler.js';

export function createTaskRouter(tasks: TaskService): Router {
  const router = Router();

  router.get('/', (_request: Request, response: Response) => {
    response.status(200).json({ data: tasks.list() });
  });

  router.post('/', (request: Request, response: Response) => {
    const task = tasks.create(validateCreateTask(request.body));
    response.status(201).json({ data: task });
  });

  router.get('/:id', (request: Request, response: Response) => {
    const task = tasks.getById(parseTaskId(request.params.id));
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    response.status(200).json({ data: task });
  });

  router.patch('/:id', (request: Request, response: Response) => {
    const task = tasks.update(
      parseTaskId(request.params.id),
      validateUpdateTask(request.body),
    );
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    response.status(200).json({ data: task });
  });

  router.delete('/:id', (request: Request, response: Response) => {
    if (!tasks.delete(parseTaskId(request.params.id))) {
      throw new NotFoundError('Task not found');
    }
    response.status(204).end();
  });

  return router;
}
