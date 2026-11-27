// Deliberately ambiguous error handling for PR-Norms.
export async function getTaskUnsafe(id: number, load: (id: number) => Promise<unknown>) {
  try {
    return await load(id);
  } catch {
    return null;
  }
}
