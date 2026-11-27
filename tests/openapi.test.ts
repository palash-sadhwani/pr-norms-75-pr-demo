import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestServer } from './test-server.js';

test('OpenAPI endpoint documents task routes and list bounds', async (context) => {
  const api = await createTestServer();
  context.after(api.close);

  const response = await fetch(`${api.baseUrl}/openapi.json`);
  assert.equal(response.status, 200);
  const document = await response.json() as {
    openapi: string;
    paths: Record<string, Record<string, { parameters?: Array<{ name: string; schema: { maximum?: number } }> }>>;
  };
  assert.equal(document.openapi, '3.1.0');
  assert.ok(document.paths['/tasks/{id}/complete']?.post);
  assert.equal(
    document.paths['/tasks']?.get?.parameters?.find((parameter) => parameter.name === 'limit')?.schema.maximum,
    100,
  );
});
