import type { Request, Response } from 'express';
import type { TaskService } from '../services/task-service.js';
import { parseTaskId, parseTaskListOptions, validateCreateTask, validateUpdateTask } from '../validation/task-validation.js';
import { NotFoundError } from '../middleware/error-handler.js';

export class TaskController {
  constructor(private readonly tasks: TaskService) {}

  list = (request: Request, response: Response): void => {
    const options = parseTaskListOptions(
      request.query.limit,
      request.query.offset,
      request.query.status,
    );
    response.status(200).json({
      data: this.tasks.list(options),
      pagination: options,
    });
  };

  create = (request: Request, response: Response): void => {
    const task = this.tasks.create(validateCreateTask(request.body));
    response.location(`/tasks/${task.id}`).status(201).json({ data: task });
  };

  getById = (request: Request, response: Response): void => {
    const task = this.tasks.getById(parseTaskId(request.params.id));
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    response.status(200).json({ data: task });
  };

  update = (request: Request, response: Response): void => {
    const task = this.tasks.update(
      parseTaskId(request.params.id),
      validateUpdateTask(request.body),
    );
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    response.status(200).json({ data: task });
  };

  delete = (request: Request, response: Response): void => {
    if (!this.tasks.delete(parseTaskId(request.params.id))) {
      throw new NotFoundError('Task not found');
    }
    response.status(204).end();
  };
}
