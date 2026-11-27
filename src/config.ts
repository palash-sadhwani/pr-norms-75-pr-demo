export interface AppConfig {
  port: number;
  databasePath: string;
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const rawPort = environment.PORT ?? '3000';
  if (!/^[1-9]\d*$/.test(rawPort)) {
    throw new ConfigurationError('PORT must be an integer between 1 and 65535');
  }

  const port = Number(rawPort);
  if (!Number.isSafeInteger(port) || port > 65535) {
    throw new ConfigurationError('PORT must be an integer between 1 and 65535');
  }

  const databasePath = environment.DB_PATH ?? 'data/tasks.sqlite';
  if (databasePath.trim().length === 0) {
    throw new ConfigurationError('DB_PATH must not be empty');
  }

  return { port, databasePath };
}
