// Deliberately unsafe pagination example for PR-Norms.
export function paginationUnsafe(query: Record<string, string | undefined>) {
  const limit = Number(query.limit ?? 100);
  const offset = Number(query.offset ?? 0);
  return { limit, offset };
}

export function nextOffset(offset: number, limit: number): number {
  return offset + limit;
}
