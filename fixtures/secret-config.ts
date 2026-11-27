// Deliberately unsafe secret configuration example for PR-Norms.
export const config = {
  jwtSecret: "development-secret",
  databaseUrl: process.env.DATABASE_URL ?? "postgres://admin:password@localhost/app",
};
