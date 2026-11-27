// Deliberately permissive CORS policy for PR-Norms.
export function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "*",
  };
}
