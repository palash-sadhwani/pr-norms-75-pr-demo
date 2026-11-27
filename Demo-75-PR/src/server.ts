import { createApp } from './app.js';
import { openDatabase } from './db/connection.js';

const port = Number(process.env.PORT ?? 3000);
const database = openDatabase();

createApp().listen(port, () => {
  console.log(`Task Manager API listening on port ${port}`);
});

process.on('SIGINT', () => {
  database.close();
  process.exit(0);
});
