import type { DatabaseSync, SQLOutputValue } from 'node:sqlite';
import { taskStatuses, type CreateTaskInput, type Task, type TaskListOptions, type TaskStatus, type UpdateTaskInput } from '../domain/task.js';

type TaskRow = Record<string, SQLOutputValue>;

function isTaskStatus(value: unknown): value is TaskStatus {
  return taskStatuses.some((status) => status === value);
}

function mapTask(row: TaskRow | undefined): Task | null {
  if (!row) {
    return null;
  }

  const { id, title, description, status, created_at: createdAt, updated_at: updatedAt } = row;
  const numericId = typeof id === 'bigint' ? Number(id) : id;
  if (
    typeof numericId !== 'number' ||
    !Number.isSafeInteger(numericId) ||
    typeof title !== 'string' ||
    (description !== null && typeof description !== 'string') ||
    !isTaskStatus(status) ||
    typeof createdAt !== 'string' ||
    typeof updatedAt !== 'string'
  ) {
    throw new Error('Database returned a task row with an invalid shape');
  }

  return { id: numericId, title, description, status, createdAt, updatedAt };
}

export class TaskRepository {
  constructor(private readonly database: DatabaseSync) {}

  create(input: CreateTaskInput): Task {
    const result = this.database
      .prepare('INSERT INTO tasks (title, description) VALUES (?, ?)')
      .run(input.title, input.description ?? null);
    const task = this.getById(Number(result.lastInsertRowid));
    if (!task) {
      throw new Error('Inserted task could not be loaded');
    }
    return task;
  }

  getById(id: number): Task | null {
    return mapTask(this.database.prepare('SELECT * FROM tasks WHERE id = ?').get(id));
  }

  list(options: TaskListOptions = { limit: 20, offset: 0 }): Task[] {
    const statusFilter = options.status === undefined ? '' : ' WHERE status = ?';
    const values = options.status === undefined
      ? [options.limit, options.offset]
      : [options.status, options.limit, options.offset];
    return this.database
      .prepare(`SELECT * FROM tasks${statusFilter} ORDER BY id ASC LIMIT ? OFFSET ?`)
      .all(...values)
      .map((row) => {
      const task = mapTask(row);
      if (!task) {
        throw new Error('Database returned an empty task row');
      }
      return task;
      });
  }

  update(id: number, input: UpdateTaskInput): Task | null {
    const fields: string[] = [];
    const values: (string | null)[] = [];

    if (input.title !== undefined) {
      fields.push('title = ?');
      values.push(input.title);
    }
    if (input.description !== undefined) {
      fields.push('description = ?');
      values.push(input.description);
    }
    if (input.status !== undefined) {
      fields.push('status = ?');
      values.push(input.status);
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    fields.push("updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')");
    const result = this.database
      .prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`)
      .run(...values, id);
    return Number(result.changes) > 0 ? this.getById(id) : null;
  }

  delete(id: number): boolean {
    const result = this.database.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return Number(result.changes) > 0;
  }
}
