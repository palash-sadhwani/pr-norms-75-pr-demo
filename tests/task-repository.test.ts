import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { openDatabase } from '../src/db/connection.js';
import { runMigrations } from '../src/db/migrations.js';
import { TaskRepository } from '../src/db/task-repository.js';

test('repository performs task CRUD using a persistent SQLite database', (context) => {
  const directory = mkdtempSync(join(tmpdir(), 'task-repository-'));
  const database = openDatabase(join(directory, 'tasks.sqlite'));
  runMigrations(database, resolve('migrations'));
  context.after(() => {
    database.close();
    rmSync(directory, { recursive: true, force: true });
  });

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
