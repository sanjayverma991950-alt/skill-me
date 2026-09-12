import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Error Handling Middleware Tests', () => {
  const app = createApp();

  it('should return 404 with standard NOT_FOUND error structure for non-existent routes', async () => {
    const response = await request(app).get('/api/v1/non-existent-resource');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(response.body.error.message).toContain('not found');
    expect(response.body.timestamp).toBeDefined();
  });

  it('should return 400 when malformed JSON is posted', async () => {
    const response = await request(app)
      .post('/api/v1/skills')
      .set('Content-Type', 'application/json')
      .send('{ "invalidJson": ');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('INVALID_JSON');
  });
});
