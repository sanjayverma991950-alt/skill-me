import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Health API Integration Tests', () => {
  const app = createApp();

  it('GET /api/v1/health should return 200 with healthy status and metadata', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('healthy');
    expect(response.body.data.environment).toBeDefined();
    expect(response.body.data.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(response.body.data.system).toBeDefined();
    expect(response.body.timestamp).toBeDefined();
  });

  it('GET / should return root API metadata and endpoints list', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.endpoints).toContain('/api/v1/health');
  });
});
