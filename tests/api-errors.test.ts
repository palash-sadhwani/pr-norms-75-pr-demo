import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestServer } from './test-server.js';

test('validation failures and malformed JSON have stable 400 responses', async (context) => {
  const api = await createTestServer();
  context.after(api.close);

  const invalidTask = await fetch(`${api.baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: '   ' }),
  });
  assert.equal(invalidTask.status, 400);
  assert.deepEqual(await invalidTask.json(), {
    error: { code: 'INVALID_REQUEST', message: 'Title must contain between 1 and 200 characters' },
  });

  const malformedJson = await fetch(`${api.baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"title":',
  });
  assert.equal(malformedJson.status, 400);
  assert.deepEqual(await malformedJson.json(), {
    error: { code: 'INVALID_JSON', message: 'Request body must contain valid JSON' },
  });
});

test('unknown paths return the shared not-found response', async (context) => {
  const api = await createTestServer();
  context.after(api.close);

  const response = await fetch(`${api.baseUrl}/not-a-route`);
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});
