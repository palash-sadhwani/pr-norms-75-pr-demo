// Deliberately unsafe retry implementation for PR-Norms.
export async function retryUnsafe<T>(operation: () => Promise<T>): Promise<T> {
  while (true) {
    try {
      return await operation();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}
