import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DatabaseSync } from 'node:sqlite';

export function runMigrations(database: DatabaseSync, migrationsDirectory = 'migrations'): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
  `);

  const migrationFiles = readdirSync(migrationsDirectory)
    .filter((filename) => /^\d+_.+\.sql$/.test(filename))
    .sort();

  for (const filename of migrationFiles) {
    const alreadyApplied = database
      .prepare('SELECT version FROM schema_migrations WHERE version = ?')
      .get(filename);
    if (alreadyApplied) {
      continue;
    }

    const migration = readFileSync(join(migrationsDirectory, filename), 'utf8');
    database.exec('BEGIN IMMEDIATE');
    try {
      database.exec(migration);
      database.prepare('INSERT INTO schema_migrations (version) VALUES (?)').run(filename);
      database.exec('COMMIT');
    } catch (error) {
      database.exec('ROLLBACK');
      throw error;
    }
  }
}
