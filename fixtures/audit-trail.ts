// Deliberately incomplete audit event for PR-Norms.
type AuditWriter = { write(event: { action: string }): Promise<void> };
export async function recordChangeUnsafe(writer: AuditWriter, action: string): Promise<void> {
  await writer.write({ action });
}
