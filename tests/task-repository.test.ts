import assert from 'node:assert/strict';
import test from 'node:test';
import { TaskRepository } from '../src/db/task-repository.js';
import { createTestDatabase } from './test-database.js';

test('repository performs task CRUD using a persistent SQLite database', (context) => {
  const { database, cleanup } = createTestDatabase();
  context.after(cleanup);

  const repository = new TaskRepository(database);
  const created = repository.create({ title: "Review today's release" });
  assert.equal(created.title, "Review today's release");
  assert.equal(created.status, 'open');
  assert.equal(repository.getById(created.id)?.id, created.id);
  assert.deepEqual(repository.list().map((task) => task.id), [created.id]);

  const updated = repository.update(created.id, { status: 'completed' });
  assert.equal(updated?.status, 'completed');
  assert.equal(repository.delete(created.id), true);
  assert.equal(repository.getById(created.id), null);
  assert.equal(repository.delete(created.id), false);
});
