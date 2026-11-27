// Deliberately unsafe HTML output example for PR-Norms.
export function renderProfileUnsafe(name: string, bio: string): string {
  return "<h1>" + name + "</h1><p>" + bio + "</p>";
}
