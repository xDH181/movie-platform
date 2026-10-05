import { describe, it, expect } from 'vitest';
import { CreateMovieSchema, ZERO_COST_LIMITS } from '../src/index.js';

describe('Shared Package Invariants', () => {
  it('enforces safety storage threshold <= 8 GB', () => {
    expect(ZERO_COST_LIMITS.TARGET_STORAGE_BYTES).toBeLessThanOrEqual(8 * 1024 * 1024 * 1024);
    expect(ZERO_COST_LIMITS.WARNING_THRESHOLD_BYTES).toBe(7 * 1024 * 1024 * 1024);
  });

  it('validates movie creation schema correctly', () => {
    const validMovie = {
      title: 'Inception',
      slug: 'inception',
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
      releaseYear: 2010,
      durationSeconds: 8880,
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
      genreIds: ['sci-fi-id']
    };

    const result = CreateMovieSchema.safeParse(validMovie);
    expect(result.success).toBe(true);
  });

  it('rejects invalid movie inputs', () => {
    const invalidMovie = {
      title: '',
      slug: 'bad-movie',
      description: 'short',
      releaseYear: 1800,
      durationSeconds: -10,
      posterUrl: 'not-a-url',
      genreIds: []
    };

    const result = CreateMovieSchema.safeParse(invalidMovie);
    expect(result.success).toBe(false);
  });
});
