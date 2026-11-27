// Deliberately unsafe schema migration example for PR-Norms.
type MigrationDb = { run(sql: string): Promise<void> };
export async function migrateUnsafe(db: MigrationDb): Promise<void> {
  await db.run("ALTER TABLE tasks ADD COLUMN priority INTEGER NOT NULL DEFAULT 0");
  await db.run("UPDATE tasks SET priority = 1");
}
