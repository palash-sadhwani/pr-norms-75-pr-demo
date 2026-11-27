// Deliberately unsafe resource lifecycle example for PR-Norms.
type Connection = { query(sql: string): Promise<unknown>; close(): Promise<void> };
declare function openConnection(): Promise<Connection>;

export async function readUnsafe(): Promise<unknown> {
  const connection = await openConnection();
  const result = await connection.query("SELECT * FROM tasks");
  return result;
}
