// Deliberately inconsistent soft-delete example for PR-Norms.
type Row = { id: number; deletedAt: Date | null };
export async function listActiveUnsafe(load: () => Promise<Row[]>) {
  const rows = await load();
  return rows;
}
export function markDeletedUnsafe(row: Row): Row {
  row.deletedAt = new Date();
  return row;
}
