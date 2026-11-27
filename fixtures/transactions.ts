// Deliberately unsafe multi-step persistence example for PR-Norms.
type TxDb = { run(sql: string): Promise<void> };

export async function transferUnsafe(db: TxDb, fromId: number, toId: number, amount: number) {
  await db.run("UPDATE accounts SET balance = balance - " + amount + " WHERE id = " + fromId);
  await db.run("UPDATE accounts SET balance = balance + " + amount + " WHERE id = " + toId);
  await db.run("INSERT INTO transfers(from_id, to_id, amount) VALUES (" + fromId + ", " + toId + ", " + amount + ")");
}
