import assert from 'node:assert/strict';
import test from 'node:test';
import { createTestServer } from './test-server.js';

test('task routes expose CRUD operations with stable response envelopes', async (context) => {
  const api = await createTestServer();
  context.after(api.close);

  const initialList = await fetch(`${api.baseUrl}/tasks`);
  assert.equal(initialList.status, 200);
  assert.match(initialList.headers.get('x-request-id') ?? '', /^[\da-f-]{36}$/i);
  assert.deepEqual(await initialList.json(), {
    data: [],
    pagination: { limit: 20, offset: 0 },
  });

  const createdResponse = await fetch(`${api.baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: 'Review API changes' }),
  });

  test('task list uses the requested bounded page', async (context) => {
    const api = await createTestServer();
    context.after(api.close);

    for (const title of ['First task', 'Second task', 'Third task']) {
      await fetch(`${api.baseUrl}/tasks`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title }),
      });
    }

    const response = await fetch(`${api.baseUrl}/tasks?limit=1&offset=1`);
    assert.equal(response.status, 200);
    const page = await response.json() as {
      data: Array<{ title: string }>;
      pagination: { limit: number; offset: number };
    };
    assert.deepEqual(page.data.map((task) => task.title), ['Second task']);
    assert.deepEqual(page.pagination, { limit: 1, offset: 1 });
  });

  test('task list can be filtered by a supported status', async (context) => {
    const api = await createTestServer();
    context.after(api.close);

    const createdResponse = await fetch(`${api.baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Complete this task' }),
    });
    const created = await createdResponse.json() as { data: { id: number } };
    await fetch(`${api.baseUrl}/tasks/${created.data.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    });

    const response = await fetch(`${api.baseUrl}/tasks?status=completed`);
    assert.equal(response.status, 200);
    const page = await response.json() as { data: Array<{ status: string }> };
    assert.deepEqual(page.data.map((task) => task.status), ['completed']);
  });

  test('completing a task is safe to retry', async (context) => {
    const api = await createTestServer();
    context.after(api.close);

    const createResponse = await fetch(`${api.baseUrl}/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Ship the feature' }),
    });
    const created = await createResponse.json() as { data: { id: number } };

    const firstCompletion = await fetch(`${api.baseUrl}/tasks/${created.data.id}/complete`, { method: 'POST' });
    const firstTask = await firstCompletion.json() as { data: { status: string; updatedAt: string } };
    const secondCompletion = await fetch(`${api.baseUrl}/tasks/${created.data.id}/complete`, { method: 'POST' });
    const secondTask = await secondCompletion.json() as { data: { status: string; updatedAt: string } };

    assert.equal(firstCompletion.status, 200);
    assert.equal(secondCompletion.status, 200);
    assert.equal(firstTask.data.status, 'completed');
    assert.equal(secondTask.data.updatedAt, firstTask.data.updatedAt);
  });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json() as { data: { id: number; title: string } };
  assert.equal(createdResponse.headers.get('location'), `/tasks/${created.data.id}`);
  assert.equal(created.data.title, 'Review API changes');

  const fetched = await fetch(`${api.baseUrl}/tasks/${created.data.id}`);
  assert.equal(fetched.status, 200);
  assert.equal((await fetched.json() as { data: { id: number } }).data.id, created.data.id);

  const updatedResponse = await fetch(`${api.baseUrl}/tasks/${created.data.id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status: 'completed' }),
  });
  assert.equal(updatedResponse.status, 200);
  assert.equal((await updatedResponse.json() as { data: { status: string } }).data.status, 'completed');

  const deleted = await fetch(`${api.baseUrl}/tasks/${created.data.id}`, { method: 'DELETE' });
  assert.equal(deleted.status, 204);
  const missing = await fetch(`${api.baseUrl}/tasks/${created.data.id}`);
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { error: { code: 'NOT_FOUND', message: 'Task not found' } });
});
