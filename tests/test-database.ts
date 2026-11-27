import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { openDatabase } from '../src/db/connection.js';
import { runMigrations } from '../src/db/migrations.js';

export function createTestDatabase() {
  const directory = mkdtempSync(join(tmpdir(), 'task-api-test-'));
  const database = openDatabase(join(directory, 'tasks.sqlite'));
  runMigrations(database, resolve('migrations'));

  return {
    database,
    cleanup() {
      database.close();
      rmSync(directory, { recursive: true, force: true });
    },
  };
}
