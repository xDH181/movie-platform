import { Hono } from 'hono';
import { catalogStore } from '../db/store.js';

export const genresRouter = new Hono();

genresRouter.get('/', (c) => {
  const genres = catalogStore.getGenres();
  return c.json({
    data: genres,
    total: genres.length
  });
});
