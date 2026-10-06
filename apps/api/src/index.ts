import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ZERO_COST_LIMITS } from '@movie/shared';
import { genresRouter } from './routes/genres.js';
import { moviesRouter } from './routes/movies.js';
import { adminRouter } from './routes/admin.js';
import { userRouter } from './routes/user.js';

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
    version: '0.4.0',
    gate: 'Gate 4 — Movie Catalog API'
  });
});

// Mount catalog and management endpoints
app.route('/api/v1/genres', genresRouter);
app.route('/api/v1/movies', moviesRouter);
app.route('/api/v1/admin', adminRouter);
app.route('/api/v1/user', userRouter);

export default app;
