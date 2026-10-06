import { describe, it, expect } from 'vitest';
import { createTypedSupabaseClient } from '../src/index.js';
import fs from 'fs';
import path from 'path';

describe('Supabase DB & Auth Specifications', () => {
  it('creates typed client instance successfully with config', () => {
    const client = createTypedSupabaseClient({
      supabaseUrl: 'https://sample-project.supabase.co',
      supabaseAnonKey: 'sample-anon-key'
    });

    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.from).toBeDefined();
  });

  it('verifies all 3 SQL migrations exist and contain required tables and policies', () => {
    const migrationsDir = path.resolve(__dirname, '../../../supabase/migrations');
    expect(fs.existsSync(migrationsDir)).toBe(true);

    const schemaSql = fs.readFileSync(path.join(migrationsDir, '20261006_001_initial_schema.sql'), 'utf-8');
    const rlsSql = fs.readFileSync(path.join(migrationsDir, '20261006_002_rls_policies.sql'), 'utf-8');
    const seedSql = fs.readFileSync(path.join(migrationsDir, '20261006_003_seed_data.sql'), 'utf-8');

    // 1. Schema check
    expect(schemaSql).toContain('CREATE TABLE IF NOT EXISTS public.profiles');
    expect(schemaSql).toContain('CREATE TABLE IF NOT EXISTS public.movies');
    expect(schemaSql).toContain('CREATE TABLE IF NOT EXISTS public.genres');
    expect(schemaSql).toContain('CREATE TABLE IF NOT EXISTS public.movie_genres');
    expect(schemaSql).toContain('CREATE TABLE IF NOT EXISTS public.favorites');
    expect(schemaSql).toContain('CREATE TABLE IF NOT EXISTS public.watch_history');
    expect(schemaSql).toContain('CREATE TRIGGER on_auth_user_created');

    // 2. RLS check
    expect(rlsSql).toContain('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY');
    expect(rlsSql).toContain('ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY');
    expect(rlsSql).toContain('CREATE OR REPLACE FUNCTION public.is_admin()');
    expect(rlsSql).toContain('CREATE POLICY "Published movies are readable by all"');

    // 3. Seed check
    expect(seedSql).toContain('cyber-chronicles');
    expect(seedSql).toContain('stellar-odyssey');
    expect(seedSql).toContain('shadow-velocity');
  });
});
