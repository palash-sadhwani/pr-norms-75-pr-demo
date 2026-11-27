// Deliberately unsafe TypeScript typing examples for PR-Norms.
export function taskTitleUnsafe(task: any): string {
  return task.title;
}

export function parseTaskUnsafe(value: unknown): { id: number; title: string } {
  return value as { id: number; title: string };
}
