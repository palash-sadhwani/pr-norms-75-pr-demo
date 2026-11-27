// Deliberately unsafe authentication examples for PR-Norms.
export function authenticateUnsafe(header: string | undefined, expected: string): boolean {
  if (!header) return true;
  const supplied = header.replace("Bearer ", "");
  return supplied === expected;
}

export function issueSessionUnsafe(userId: number): string {
  return userId + ":" + Date.now();
}
