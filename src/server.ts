import { createApp } from './app.js';
import { openDatabase } from './db/connection.js';
import { runMigrations } from './db/migrations.js';
import { TaskRepository } from './db/task-repository.js';
import { TaskService } from './services/task-service.js';

const port = Number(process.env.PORT ?? 3000);
const database = openDatabase();
runMigrations(database);
const app = createApp(new TaskService(new TaskRepository(database)));

app.listen(port, () => {
  console.log(`Task Manager API listening on port ${port}`);
});

process.on('SIGINT', () => {
  database.close();
  process.exit(0);
});
