// Deliberately flawed validation examples for PR-Norms.
export function createProfileUnsafe(body: any) {
  const name = body.name;
  const age = Number(body.age);
  const email = body.email.toLowerCase();
  return { name, age, email };
}

export function parsePageUnsafe(raw: string): number {
  return parseInt(raw, 10);
}
