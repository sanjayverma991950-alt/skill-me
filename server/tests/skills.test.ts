import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Skills Module Integration & Validation Tests', () => {
  const app = createApp();

  it('GET /api/v1/skills should return 200 with initial skills list', async () => {
    const response = await request(app).get('/api/v1/skills');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.meta.total).toBe(response.body.data.length);
  });

  it('POST /api/v1/skills should reject invalid payload with 400 and validation error details', async () => {
    const invalidPayload = {
      title: 'Hi', // too short (< 3 chars)
      category: '', // too short
    };

    const response = await request(app).post('/api/v1/skills').send(invalidPayload);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(response.body.error.details)).toBe(true);
  });

  it('POST /api/v1/skills should successfully create a valid skill with 201', async () => {
    const newSkill = {
      title: 'DevOps & CI/CD Pipeline Automation',
      description: 'Master automated GitHub Actions, Docker workflows, and cloud deployments.',
      category: 'DevOps',
      level: 'Intermediate',
      tags: ['CI/CD', 'Docker', 'Automation'],
      featured: true,
    };

    const response = await request(app).post('/api/v1/skills').send(newSkill);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();
    expect(response.body.data.slug).toBe('devops-ci-cd-pipeline-automation');
    expect(response.body.data.title).toBe(newSkill.title);
  });

  it('POST /api/v1/skills should return 409 Conflict when creating a duplicate skill title', async () => {
    const duplicateSkill = {
      title: 'DevOps & CI/CD Pipeline Automation',
      description: 'Another duplicate attempt with same title.',
      category: 'DevOps',
      level: 'Intermediate',
      tags: ['CI/CD'],
    };

    const response = await request(app).post('/api/v1/skills').send(duplicateSkill);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('CONFLICT');
  });

  it('GET /api/v1/skills/:id should return 404 for non-existent UUID', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app).get(`/api/v1/skills/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('GET /api/v1/skills/:id should return 400 for non-UUID id', async () => {
    const invalidId = 'not-a-uuid-123';
    const response = await request(app).get(`/api/v1/skills/${invalidId}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
