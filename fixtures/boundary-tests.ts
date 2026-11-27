// Deliberately incomplete boundary test for PR-Norms.
export function validateLimit(limit: number): boolean {
  return limit >= 1 && limit <= 100;
}
export function testLimit() {
  if (!validateLimit(10)) throw new Error("expected valid limit");
}
