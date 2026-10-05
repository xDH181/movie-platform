import { describe, it, expect } from 'vitest';
import { app } from '../src/index.js';

describe('API Health & Baseline Routes', () => {
  it('GET /health returns status ok with shared constants', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.limits.targetStorageBytes).toBe(8 * 1024 * 1024 * 1024);
  });

  it('GET /api/v1/info returns system info', async () => {
    const res = await app.request('/api/v1/info');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.name).toContain('Movie Streaming Platform');
  });
});
