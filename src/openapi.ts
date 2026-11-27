export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'Task Manager API',
    version: '1.0.0',
    description: 'Create, inspect, update, and complete tasks.',
  },
  paths: {
    '/health': {
      get: { responses: { '200': { description: 'Service is responding' } } },
    },
    '/tasks': {
      get: {
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', minimum: 0, maximum: 1000000 } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['open', 'in_progress', 'completed'] } },
        ],
        responses: { '200': { description: 'A page of tasks' }, '400': { description: 'Invalid query' } },
      },
      post: {
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', minLength: 1, maxLength: 200 },
                  description: { type: ['string', 'null'], maxLength: 2000 },
                },
                additionalProperties: false,
              },
            },
          },
        },
        responses: {
          '201': { description: 'Task created' },
          '400': { description: 'Invalid body' },
          '413': { description: 'Request body exceeds the configured size limit' },
        },
      },
    },
    '/tasks/{id}': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }],
      get: { responses: { '200': { description: 'Task details' }, '404': { description: 'Task not found' } } },
      patch: { responses: { '200': { description: 'Task updated' }, '400': { description: 'Invalid body' }, '404': { description: 'Task not found' } } },
      delete: { responses: { '204': { description: 'Task deleted' }, '404': { description: 'Task not found' } } },
    },
    '/tasks/{id}/complete': {
      parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }],
      post: { responses: { '200': { description: 'Task completed' }, '404': { description: 'Task not found' } } },
    },
  },
} as const;
