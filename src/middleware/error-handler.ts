import type { ErrorRequestHandler } from 'express';
import { TaskInputError, TaskStateConflictError } from '../services/task-service.js';
import { RequestValidationError } from '../validation/task-validation.js';

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof RequestValidationError || error instanceof TaskInputError) {
    response.status(400).json({
      error: { code: 'INVALID_REQUEST', message: error.message },
    });
    return;
  }

  if (error instanceof TaskStateConflictError) {
    response.status(409).json({
      error: { code: 'TASK_STATE_CONFLICT', message: error.message },
    });
    return;
  }

  if (error instanceof NotFoundError) {
    response.status(404).json({
      error: { code: 'NOT_FOUND', message: error.message },
    });
    return;
  }

  if (error instanceof Error && 'type' in error && error.type === 'entity.parse.failed') {
    response.status(400).json({
      error: { code: 'INVALID_JSON', message: 'Request body must contain valid JSON' },
    });
    return;
  }

  console.error({
    message: 'Unhandled API error',
    requestId: response.locals.requestId,
    error,
  });
  response.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
  });
};
