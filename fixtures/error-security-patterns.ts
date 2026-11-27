// Deliberately unsafe examples for PR-Norms security-norm tests.
export function exposeErrorUnsafe(response: any, error: any): void {
  response.status(500).json({ error: error.message, stack: error.stack });
}

export function logTokenUnsafe(token: string): void {
  console.warn("Authentication failed for token:", token);
}

export function logPersonalDataUnsafe(email: string, phone: string): void {
  console.info("User request", { email, phone });
}
