import assert from 'node:assert/strict';
import test from 'node:test';
import { ConfigurationError, loadConfig } from '../src/config.js';

test('configuration provides explicit defaults and accepts a valid port', () => {
  assert.deepEqual(loadConfig({}), { port: 3000, databasePath: 'data/tasks.sqlite' });
  assert.deepEqual(loadConfig({ PORT: '8080', DB_PATH: 'data/test.sqlite' }), {
    port: 8080,
    databasePath: 'data/test.sqlite',
  });
});

test('configuration rejects invalid ports and blank database paths', () => {
  assert.throws(() => loadConfig({ PORT: '0' }), ConfigurationError);
  assert.throws(() => loadConfig({ PORT: '3000x' }), ConfigurationError);
  assert.throws(() => loadConfig({ PORT: '70000' }), ConfigurationError);
  assert.throws(() => loadConfig({ DB_PATH: '   ' }), ConfigurationError);
});
