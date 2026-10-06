import { Hono } from 'hono';
import { UpdateWatchProgressSchema } from '@movie/shared';
import { catalogStore } from '../db/store.js';
import { extractUser } from '../middleware/auth.js';

export const userRouter = new Hono();

userRouter.use('*', extractUser);

// Helper to extract authenticated user id or fallback to demo/header
function getUserId(c: any): string {
  const ctxUser = c.get('user');
  if (ctxUser?.id) return ctxUser.id;
  const headerId = c.req.header('x-user-id');
  if (headerId) return headerId;
  return 'anonymous-demo-user';
}

// POST /api/v1/user/watch-progress - Update watch history progress
userRouter.post('/watch-progress', async (c) => {
  const userId = getUserId(c);
  try {
    const body = await c.req.json();
    const parsed = UpdateWatchProgressSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({
        error: 'Validation failed',
        details: parsed.error.flatten()
      }, 400);
    }

    const item = catalogStore.updateWatchProgress(userId, parsed.data);
    return c.json({ data: item, message: 'Watch progress saved' });
  } catch (err: any) {
    return c.json({ error: 'Invalid JSON payload', message: err?.message }, 400);
  }
});

// GET /api/v1/user/watch-history - Get watch history for current user
userRouter.get('/watch-history', (c) => {
  const userId = getUserId(c);
  const items = catalogStore.getUserWatchHistory(userId);
  return c.json({ data: items, total: items.length });
});

// GET /api/v1/user/favorites - Get list of favorite movie IDs
userRouter.get('/favorites', (c) => {
  const userId = getUserId(c);
  const favorites = catalogStore.getFavorites(userId);
  return c.json({ data: favorites, total: favorites.length });
});

// POST /api/v1/user/favorites/:movieId - Add movie to user favorites
userRouter.post('/favorites/:movieId', (c) => {
  const userId = getUserId(c);
  const movieId = c.req.param('movieId');
  catalogStore.addFavorite(userId, movieId);
  return c.json({ success: true, message: `Added movie ${movieId} to favorites` });
});

// DELETE /api/v1/user/favorites/:movieId - Remove movie from favorites
userRouter.delete('/favorites/:movieId', (c) => {
  const userId = getUserId(c);
  const movieId = c.req.param('movieId');
  catalogStore.removeFavorite(userId, movieId);
  return c.json({ success: true, message: `Removed movie ${movieId} from favorites` });
});
