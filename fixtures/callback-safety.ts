// Deliberately unsafe callback flow for PR-Norms.
export function loadValueUnsafe(
  callback: (error: Error | null, value?: string) => void,
): void {
  callback(null, "first");
  callback(new Error("late failure"));
}
