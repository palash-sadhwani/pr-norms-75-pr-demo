import { taskStatuses, type CreateTaskInput, type TaskListOptions, type TaskStatus, type UpdateTaskInput } from '../domain/task.js';

export class RequestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestValidationError';
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new RequestValidationError('Request body must be an object');
  }
  return value as Record<string, unknown>;
}

function assertAllowedKeys(record: Record<string, unknown>, allowed: readonly string[]): void {
  const unexpected = Object.keys(record).find((key) => !allowed.includes(key));
  if (unexpected) {
    throw new RequestValidationError(`Unexpected field: ${unexpected}`);
  }
}

function validateTitle(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > 200) {
    throw new RequestValidationError('Title must contain between 1 and 200 characters');
  }
  return value;
}

function validateDescription(value: unknown): string | null {
  if (value !== null && (typeof value !== 'string' || value.length > 2000)) {
    throw new RequestValidationError('Description must be a string of at most 2000 characters or null');
  }
  return value;
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return taskStatuses.some((status) => status === value);
}

export function validateCreateTask(value: unknown): CreateTaskInput {
  const record = asRecord(value);
  assertAllowedKeys(record, ['title', 'description']);
  const input: CreateTaskInput = { title: validateTitle(record.title) };
  if ('description' in record) {
    input.description = validateDescription(record.description);
  }
  return input;
}

export function validateUpdateTask(value: unknown): UpdateTaskInput {
  const record = asRecord(value);
  assertAllowedKeys(record, ['title', 'description', 'status']);
  if (Object.keys(record).length === 0) {
    throw new RequestValidationError('At least one task field must be provided');
  }

  const input: UpdateTaskInput = {};
  if ('title' in record) {
    input.title = validateTitle(record.title);
  }
  if ('description' in record) {
    input.description = validateDescription(record.description);
  }
  if ('status' in record) {
    if (!isTaskStatus(record.status)) {
      throw new RequestValidationError(`Status must be one of: ${taskStatuses.join(', ')}`);
    }
    input.status = record.status;
  }
  return input;
}

export function parseTaskId(value: unknown): number {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    throw new RequestValidationError('Task id must be a positive integer');
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id)) {
    throw new RequestValidationError('Task id is outside the supported range');
  }
  return id;
}

function parseIntegerQuery(value: unknown, fallback: number, field: string): number {
  if (value === undefined) {
    return fallback;
  }
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new RequestValidationError(`${field} must be a non-negative integer`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    throw new RequestValidationError(`${field} is outside the supported range`);
  }
  return parsed;
}

export function parseTaskListOptions(
  limitValue: unknown,
  offsetValue: unknown,
  statusValue?: unknown,
): TaskListOptions {
  const limit = parseIntegerQuery(limitValue, 20, 'limit');
  const offset = parseIntegerQuery(offsetValue, 0, 'offset');
  if (limit < 1 || limit > 100) {
    throw new RequestValidationError('limit must be between 1 and 100');
  }
  if (offset > 1_000_000) {
    throw new RequestValidationError('offset must not exceed 1000000');
  }
  if (statusValue !== undefined && !isTaskStatus(statusValue)) {
    throw new RequestValidationError(`status must be one of: ${taskStatuses.join(', ')}`);
  }
  return statusValue === undefined
    ? { limit, offset }
    : { limit, offset, status: statusValue };
}
