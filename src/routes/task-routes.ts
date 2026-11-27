import { Router } from 'express';
import { TaskController } from '../controllers/task-controller.js';
import type { TaskService } from '../services/task-service.js';

export function createTaskRouter(tasks: TaskService): Router {
  const router = Router();
  const controller = new TaskController(tasks);

  router.get('/', controller.list);
  router.post('/', controller.create);
  router.get('/:id', controller.getById);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
