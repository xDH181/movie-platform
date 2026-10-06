import { Hono } from 'hono';
import { CreateMovieSchema, UpdateMovieSchema } from '@movie/shared';
import { catalogStore } from '../db/store.js';
import { requireAdmin } from '../middleware/auth.js';

export const adminRouter = new Hono();

// Enforce admin privileges on all admin catalog operations
adminRouter.use('*', requireAdmin);

// POST /api/v1/admin/movies - Create new movie
adminRouter.post('/movies', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = CreateMovieSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({
        error: 'Validation failed',
        details: parsed.error.flatten()
      }, 400);
    }

    const movie = catalogStore.createMovie(parsed.data);
    return c.json({ data: movie, message: 'Movie created successfully' }, 201);
  } catch (err: any) {
    return c.json({ error: 'Invalid JSON payload', message: err?.message }, 400);
  }
});

// PUT /api/v1/admin/movies/:id - Update existing movie
adminRouter.put('/movies/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const parsed = UpdateMovieSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({
        error: 'Validation failed',
        details: parsed.error.flatten()
      }, 400);
    }

    const updated = catalogStore.updateMovie(id, parsed.data);
    if (!updated) {
      return c.json({ error: 'Movie not found', message: `No movie with ID '${id}'` }, 404);
    }

    return c.json({ data: updated, message: 'Movie updated successfully' });
  } catch (err: any) {
    return c.json({ error: 'Invalid JSON payload', message: err?.message }, 400);
  }
});

// DELETE /api/v1/admin/movies/:id - Delete movie
adminRouter.delete('/movies/:id', (c) => {
  const id = c.req.param('id');
  const deleted = catalogStore.deleteMovie(id);

  if (!deleted) {
    return c.json({ error: 'Movie not found', message: `No movie with ID '${id}'` }, 404);
  }

  return c.json({ success: true, message: `Movie '${id}' deleted successfully` });
});
