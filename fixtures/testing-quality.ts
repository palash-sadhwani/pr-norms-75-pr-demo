// Deliberately weak test examples for PR-Norms.
export async function testCreateTask(create: (title: string) => Promise<any>) {
  const result = await create("demo");
  console.log(result);
}

export function flakyExpectedValue(): number {
  return Date.now() % 10;
}
