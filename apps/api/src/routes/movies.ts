import { Hono } from 'hono';
import { MovieQuerySchema } from '@movie/shared';
import { catalogStore } from '../db/store.js';

export const moviesRouter = new Hono();

// GET /api/v1/movies - List movies with pagination, genre filtering, and search
moviesRouter.get('/', (c) => {
  const query = c.req.query();
  const parsed = MovieQuerySchema.safeParse(query);

  if (!parsed.success) {
    return c.json({
      error: 'Invalid query parameters',
      details: parsed.error.flatten()
    }, 400);
  }

  const { genre, search, page, limit } = parsed.data;
  const result = catalogStore.getMovies({ genre, search, page, limit });

  return c.json({
    data: result.items,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit)
    }
  });
});

// GET /api/v1/movies/:idOrSlug - Get single movie by id or slug
moviesRouter.get('/:idOrSlug', (c) => {
  const idOrSlug = c.req.param('idOrSlug');
  const movie = catalogStore.getMovieByIdOrSlug(idOrSlug);

  if (!movie) {
    return c.json({
      error: 'Movie not found',
      message: `No movie matching ID or slug '${idOrSlug}'`
    }, 404);
  }

  return c.json({ data: movie });
});
