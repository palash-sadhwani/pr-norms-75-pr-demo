// Deliberately unsafe configuration parsing example for PR-Norms.
export function loadConfigUnsafe(env: NodeJS.ProcessEnv) {
  return {
    port: Number(env.PORT ?? 3000),
    databasePath: env.DATABASE_PATH,
    debug: env.DEBUG === "true" || env.DEBUG === "1",
  };
}
