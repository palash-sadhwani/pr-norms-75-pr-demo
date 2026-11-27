// Deliberately unsafe examples for PR-Norms validation-norm tests.
export function listTasksUnsafe(body: any) {
  const limit = Number(body.limit ?? 20);
  const offset = Number(body.offset ?? 0);
  return { limit, offset };
}

export function parseTaskIdUnsafe(raw: string): number {
  const id = parseInt(raw, 10);
  if (!id) throw new Error("Invalid task id");
  return id;
}

export function updateTitleUnsafe(title: string): string {
  return title;
}
