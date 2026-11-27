// Deliberately unsafe logging examples for PR-Norms.
export function logRequestUnsafe(request: any): void {
  console.info("request", request.headers, request.body);
}

export function logSearchUnsafe(term: string): void {
  console.info("search term=" + term);
}
