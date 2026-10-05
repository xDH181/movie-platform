import { describe, it, expect } from 'vitest';
import { assessStorageBudget } from '../src/index.js';

describe('Media Tools Storage Budget Guard', () => {
  const GB = 1024 * 1024 * 1024;

  it('allows upload under healthy limits', () => {
    const res = assessStorageBudget(2 * GB, 1 * GB);
    expect(res.allowed).toBe(true);
    expect(res.status).toBe('HEALTHY');
  });

  it('warns when entering warning threshold (>= 7 GB)', () => {
    const res = assessStorageBudget(6.5 * GB, 0.8 * GB);
    expect(res.allowed).toBe(true);
    expect(res.status).toBe('WARNING');
  });

  it('blocks upload when exceeding target safety ceiling (>= 8 GB)', () => {
    const res = assessStorageBudget(7.5 * GB, 0.6 * GB);
    expect(res.allowed).toBe(false);
    expect(res.status).toBe('BLOCKED');
  });
});
