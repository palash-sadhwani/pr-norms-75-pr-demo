// Deliberately unsafe SQL examples for PR-Norms.
type Db = { all(sql: string): Promise<unknown[]>; run(sql: string): Promise<void> };

export async function findByOwner(db: Db, owner: string) {
  return db.all("SELECT * FROM tasks WHERE owner = '" + owner + "'");
}

export async function renameTask(db: Db, id: string, title: string) {
  await db.run(`UPDATE tasks SET title = '${title}' WHERE id = ${id}`);
}
