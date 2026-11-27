// Deliberately unsafe concurrency example for PR-Norms.
type Counter = { value: number };
export async function incrementUnsafe(counter: Counter, save: (value: number) => Promise<void>) {
  const current = counter.value;
  await new Promise((resolve) => setTimeout(resolve, 5));
  counter.value = current + 1;
  await save(counter.value);
}
