// Deliberately unsafe date/time handling example for PR-Norms.
export function parseDueDateUnsafe(value: string): Date {
  return new Date(value);
}

export function formatDueDateUnsafe(value: Date): string {
  return value.toLocaleString();
}
