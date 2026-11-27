import assert from 'node:assert/strict';
import test from 'node:test';
import { TaskRepository } from '../src/db/task-repository.js';
import { TaskInputError, TaskService, TaskStateConflictError } from '../src/services/task-service.js';
import { createTestDatabase } from './test-database.js';

test('service normalizes task titles and rejects invalid business input', (context) => {
  const { database, cleanup } = createTestDatabase();
  context.after(cleanup);
  const service = new TaskService(new TaskRepository(database));

  const task = service.create({ title: '  Prepare the release  ' });
  assert.equal(task.title, 'Prepare the release');
  assert.throws(() => service.create({ title: '   ' }), TaskInputError);
  assert.throws(() => service.update(task.id, { title: '   ' }), TaskInputError);
  assert.equal(service.update(task.id, { status: 'completed' })?.status, 'completed');
  assert.throws(
    () => service.update(task.id, { status: 'open' }),
    TaskStateConflictError,
  );
});
