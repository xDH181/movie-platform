import { describe, it, expect } from 'vitest';
import { app } from '../src/index.js';

describe('API Health & System Info', () => {
  it('GET /health returns status ok with shared constants', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.limits.targetStorageBytes).toBe(8 * 1024 * 1024 * 1024);
  });

  it('GET /api/v1/info returns system info with Gate 4 badge', async () => {
    const res = await app.request('/api/v1/info');
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.name).toContain('Movie Streaming Platform');
    expect(data.gate).toContain('Gate 4');
  });
});

describe('Genres API (/api/v1/genres)', () => {
  it('GET /api/v1/genres returns list of genres', async () => {
    const res = await app.request('/api/v1/genres');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.total).toBeGreaterThanOrEqual(6);
    expect(body.data.some((g: any) => g.slug === 'sci-fi')).toBe(true);
  });
});

describe('Movies Catalog API (/api/v1/movies)', () => {
  it('GET /api/v1/movies returns paginated movies with metadata', async () => {
    const res = await app.request('/api/v1/movies');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.pagination).toBeDefined();
    expect(body.pagination.page).toBe(1);
    expect(body.pagination.limit).toBe(20);
    expect(body.pagination.total).toBeGreaterThanOrEqual(6);
  });

  it('GET /api/v1/movies?genre=sci-fi filters movies by genre', async () => {
    const res = await app.request('/api/v1/movies?genre=sci-fi');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.length).toBeGreaterThan(0);
    for (const movie of body.data) {
      expect(movie.genres.some((g: any) => g.slug === 'sci-fi')).toBe(true);
    }
  });

  it('GET /api/v1/movies?search=cyber searches title or description', async () => {
    const res = await app.request('/api/v1/movies?search=cyber');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].title.toLowerCase()).toContain('cyber');
  });

  it('GET /api/v1/movies with invalid page parameter returns 400', async () => {
    const res = await app.request('/api/v1/movies?page=0');
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe('Invalid query parameters');
  });

  it('GET /api/v1/movies/:idOrSlug retrieves movie by slug', async () => {
    const res = await app.request('/api/v1/movies/cyber-chronicles-2099');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.title).toBe('Cyber Chronicles: 2099');
    expect(body.data.renditions).toContain('720p');
  });

  it('GET /api/v1/movies/:idOrSlug returns 404 for non-existent movie', async () => {
    const res = await app.request('/api/v1/movies/unknown-film-slug-xyz');
    expect(res.status).toBe(404);

    const body = await res.json();
    expect(body.error).toBe('Movie not found');
  });
});

describe('Admin Management API (/api/v1/admin)', () => {
  const adminSecret = 'streamzero-admin-secret';

  it('POST /api/v1/admin/movies rejects unauthorized request with 401', async () => {
    const res = await app.request('/api/v1/admin/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Unauthorized Film' })
    });
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/admin/movies fails validation with 400 when missing fields', async () => {
    const res = await app.request('/api/v1/admin/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminSecret
      },
      body: JSON.stringify({
        title: 'Incomplete Film'
        // Missing required slug, description, etc.
      })
    });
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toBe('Validation failed');
  });

  let createdMovieId: string;

  it('POST /api/v1/admin/movies successfully creates a movie with valid admin key', async () => {
    const res = await app.request('/api/v1/admin/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminSecret
      },
      body: JSON.stringify({
        title: 'Quantum Drift',
        slug: 'quantum-drift',
        description: 'A mind-bending journey across parallel dimensions governed by quantum flux.',
        releaseYear: 2025,
        durationSeconds: 7200,
        posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        genreIds: ['sci-fi', 'thriller']
      })
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.title).toBe('Quantum Drift');
    expect(body.data.id).toBeDefined();
    createdMovieId = body.data.id;
  });

  it('PUT /api/v1/admin/movies/:id updates movie with Bearer admin token', async () => {
    const res = await app.request(`/api/v1/admin/movies/${createdMovieId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-demo-token'
      },
      body: JSON.stringify({
        title: 'Quantum Drift: Recharged',
        releaseYear: 2026
      })
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.title).toBe('Quantum Drift: Recharged');
    expect(body.data.releaseYear).toBe(2026);
  });

  it('DELETE /api/v1/admin/movies/:id removes movie successfully', async () => {
    const res = await app.request(`/api/v1/admin/movies/${createdMovieId}`, {
      method: 'DELETE',
      headers: {
        'x-admin-key': adminSecret
      }
    });

    expect(res.status).toBe(200);

    // Verify subsequent lookup returns 404
    const getRes = await app.request(`/api/v1/movies/${createdMovieId}`);
    expect(getRes.status).toBe(404);
  });

  it('DELETE /api/v1/admin/movies/:id returns 404 when movie does not exist', async () => {
    const res = await app.request('/api/v1/admin/movies/non-existent-id-999', {
      method: 'DELETE',
      headers: {
        'x-admin-key': adminSecret
      }
    });
    expect(res.status).toBe(404);
  });
});

describe('User Features API (/api/v1/user)', () => {
  const testUserId = 'test-viewer-42';

  it('POST /api/v1/user/watch-progress updates watch progress', async () => {
    const res = await app.request('/api/v1/user/watch-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': testUserId
      },
      body: JSON.stringify({
        movieId: 'cyber-chronicles',
        positionSeconds: 1420.5,
        completed: false
      })
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.movieId).toBe('cyber-chronicles');
    expect(body.data.lastPositionSeconds).toBe(1420.5);
  });

  it('GET /api/v1/user/watch-history returns saved user progress', async () => {
    const res = await app.request('/api/v1/user/watch-history', {
      headers: {
        'x-user-id': testUserId
      }
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
    expect(body.data[0].movieId).toBe('cyber-chronicles');
  });

  it('POST & GET & DELETE /api/v1/user/favorites manages favorites list', async () => {
    // Add favorite
    const addRes = await app.request('/api/v1/user/favorites/stellar-odyssey', {
      method: 'POST',
      headers: { 'x-user-id': testUserId }
    });
    expect(addRes.status).toBe(200);

    // Check favorites
    const getRes = await app.request('/api/v1/user/favorites', {
      headers: { 'x-user-id': testUserId }
    });
    expect(getRes.status).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.data).toContain('stellar-odyssey');

    // Remove favorite
    const delRes = await app.request('/api/v1/user/favorites/stellar-odyssey', {
      method: 'DELETE',
      headers: { 'x-user-id': testUserId }
    });
    expect(delRes.status).toBe(200);

    // Verify removed
    const verifyRes = await app.request('/api/v1/user/favorites', {
      headers: { 'x-user-id': testUserId }
    });
    const verifyBody = await verifyRes.json();
    expect(verifyBody.data).not.toContain('stellar-odyssey');
  });
});
