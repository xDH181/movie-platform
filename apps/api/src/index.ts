import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ZERO_COST_LIMITS } from '@movie/shared';

export const app = new Hono();

app.use('*', cors());

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'movie-platform-api',
    limits: {
      targetStorageBytes: ZERO_COST_LIMITS.TARGET_STORAGE_BYTES,
      warningThresholdBytes: ZERO_COST_LIMITS.WARNING_THRESHOLD_BYTES
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/info', (c) => {
  return c.json({
    name: 'Zero-Cost Movie Streaming Platform API',
    version: '0.1.0',
    gate: 'Gate 1 — Monorepo Foundation'
  });
});

export default app;
