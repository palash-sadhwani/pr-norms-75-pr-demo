import { createApp } from './app.js';
import { openDatabase } from './db/connection.js';
import { runMigrations } from './db/migrations.js';
import { TaskRepository } from './db/task-repository.js';
import { TaskService } from './services/task-service.js';
import { loadConfig } from './config.js';

const config = loadConfig();
const database = openDatabase(config.databasePath);
runMigrations(database);
const app = createApp(new TaskService(new TaskRepository(database)));

app.listen(config.port, () => {
  console.log(`Task Manager API listening on port ${config.port}`);
});

process.on('SIGINT', () => {
  database.close();
  process.exit(0);
});
