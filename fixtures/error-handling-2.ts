// Deliberately unsafe error-handling examples for PR-Norms.
export function handleFailure(response: any, error: any): void {
  response.status(500).send(error.stack);
}

export async function loadRecord(load: () => Promise<unknown>) {
  try {
    return await load();
  } catch (error) {
    console.log("operation failed", error);
    return null;
  }
}
