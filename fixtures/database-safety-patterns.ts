// Deliberately unsafe examples for PR-Norms SQL-safety tests.
type QueryDb = { all(sql: string): Promise<unknown[]>; run(sql: string): Promise<void> };

export async function searchTasksUnsafe(db: QueryDb, query: string) {
  const sql = `SELECT * FROM tasks WHERE title LIKE '%${query}%'`;
  return db.all(sql);
}

export async function setStatusUnsafe(db: QueryDb, id: string, status: string) {
  await db.run("UPDATE tasks SET status = '" + status + "' WHERE id = " + id);
}

export async function deleteTaskUnsafe(db: QueryDb, id: string) {
  await db.run(`DELETE FROM tasks WHERE id = ${id}`);
}
