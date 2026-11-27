import type { CreateTaskInput, Task, TaskListOptions, UpdateTaskInput } from '../domain/task.js';
import { TaskRepository } from '../db/task-repository.js';

export class TaskInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskInputError';
  }
}

export class TaskStateConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskStateConflictError';
  }
}

function normalizeTitle(title: string): string {
  const normalized = title.trim();
  if (normalized.length === 0 || normalized.length > 200) {
    throw new TaskInputError('Task title must contain between 1 and 200 characters');
  }
  return normalized;
}

export class TaskService {
  constructor(private readonly tasks: TaskRepository) {}

  create(input: CreateTaskInput): Task {
    return this.tasks.create({
      ...input,
      title: normalizeTitle(input.title),
    });
  }

  getById(id: number): Task | null {
    return this.tasks.getById(id);
  }

  list(options: TaskListOptions): Task[] {
    return this.tasks.list(options);
  }

  update(id: number, input: UpdateTaskInput): Task | null {
    if (input.status !== undefined) {
      const current = this.tasks.getById(id);
      if (!current) {
        return null;
      }
      if (current.status === 'completed' && input.status !== 'completed') {
        throw new TaskStateConflictError('Completed tasks cannot be reopened');
      }
    }

    const normalizedInput = input.title === undefined
      ? input
      : { ...input, title: normalizeTitle(input.title) };
    return this.tasks.update(id, normalizedInput);
  }

  complete(id: number): Task | null {
    const task = this.tasks.getById(id);
    if (!task || task.status === 'completed') {
      return task;
    }
    return this.tasks.update(id, { status: 'completed' });
  }

  delete(id: number): boolean {
    return this.tasks.delete(id);
  }
}
