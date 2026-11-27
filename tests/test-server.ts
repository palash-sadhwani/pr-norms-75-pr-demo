import { createApp } from '../src/app.js';
import { TaskRepository } from '../src/db/task-repository.js';
import { TaskService } from '../src/services/task-service.js';
import { createTestDatabase } from './test-database.js';

export async function createTestServer() {
  const testDatabase = createTestDatabase();
  const server = createApp(new TaskService(new TaskRepository(testDatabase.database)))
    .listen(0, '127.0.0.1');

  await new Promise<void>((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Test server did not bind to a TCP port');
  }

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    async close() {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
      testDatabase.cleanup();
    },
  };
}
