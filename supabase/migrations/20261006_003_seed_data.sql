-- ==============================================================================
-- STREAMZERO: ZERO-COST CINEMATIC PLATFORM - SEED DATA (MIGRATION 003)
-- Seed standard genres and 6 premiere launch movies with dual HLS renditions
-- ==============================================================================

-- 1. Insert Initial Genres
INSERT INTO public.genres (id, name, slug)
VALUES
  ('sci-fi', 'Sci-Fi', 'sci-fi'),
  ('action', 'Action', 'action'),
  ('drama', 'Drama', 'drama'),
  ('thriller', 'Thriller', 'thriller'),
  ('animation', 'Animation', 'animation'),
  ('documentary', 'Documentary', 'documentary')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- 2. Insert Initial Movies
INSERT INTO public.movies (
  id, title, slug, description, release_year, duration_seconds,
  poster_url, backdrop_url, status, renditions, rating, director,
  cast_members, featured, r2_storage_prefix
) VALUES
(
  'cyber-chronicles',
  'Cyber Chronicles: 2099',
  'cyber-chronicles-2099',
  'In a dystopian neon metropolis, a rebellious hacker uncovers a quantum simulation that threatens humanity’s very concept of reality.',
  2024,
  7440,
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80',
  'PUBLISHED'::public.media_status,
  ARRAY['480p', '720p']::TEXT[],
  8.9,
  'Elena Vance',
  ARRAY['Devon Sato', 'Maya Lin', 'Caleb Cross']::TEXT[],
  true,
  'movies/cyber-chronicles-2099/'
),
(
  'stellar-odyssey',
  'Stellar Odyssey: Beyond Horizons',
  'stellar-odyssey',
  'A deep-space exploratory crew encounters a gravitational rift leading to a habitable solar system with forgotten relics of an extinct civilization.',
  2023,
  8880,
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80',
  'PUBLISHED'::public.media_status,
  ARRAY['480p', '720p']::TEXT[],
  9.1,
  'Marcus Thorne',
  ARRAY['Astrid Lindgren', 'Johnathan Drake', 'Sarah Chen']::TEXT[],
  true,
  'movies/stellar-odyssey/'
),
(
  'shadow-velocity',
  'Shadow Velocity',
  'shadow-velocity',
  'An elite covert operative is framed for a high-level cyber heist and must race through Tokyo''s underground to clear her name.',
  2024,
  6480,
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1600&auto=format&fit=crop&q=80',
  'PUBLISHED'::public.media_status,
  ARRAY['480p', '720p']::TEXT[],
  8.3,
  'Kenji Sato',
  ARRAY['Reiko Tanaka', 'Alex Mercer', 'Victor Cruz']::TEXT[],
  true,
  'movies/shadow-velocity/'
),
(
  'the-solitary-echo',
  'The Solitary Echo',
  'the-solitary-echo',
  'A reclusive sound engineer isolates himself in a coastal lighthouse only to intercept enigmatic audio broadcasts from the ocean trench.',
  2023,
  6120,
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600&auto=format&fit=crop&q=80',
  'PUBLISHED'::public.media_status,
  ARRAY['480p', '720p']::TEXT[],
  8.7,
  'Claire Beauchamp',
  ARRAY['Samuel Wright', 'Liam Gallagher', 'Nora Kelly']::TEXT[],
  false,
  'movies/the-solitary-echo/'
),
(
  'celestial-spirit',
  'Celestial Spirit: Whispers of the Forest',
  'celestial-spirit',
  'A young botanist unearths a sacred, luminescent ecosystem guarded by ancient forest spirits facing destruction by modern industry.',
  2024,
  5820,
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1600&auto=format&fit=crop&q=80',
  'PUBLISHED'::public.media_status,
  ARRAY['480p', '720p']::TEXT[],
  9.3,
  'Hayao Miyazaki Tribute',
  ARRAY['Yuki Ishikawa', 'Ren Takahashi', 'Hana Mori']::TEXT[],
  false,
  'movies/celestial-spirit/'
),
(
  'midnight-anomaly',
  'Midnight Anomaly',
  'midnight-anomaly',
  'A late-night radio host receives frantic calls from across the nation reporting the same terrifying temporal anomaly in the night sky.',
  2024,
  6720,
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1600&auto=format&fit=crop&q=80',
  'PUBLISHED'::public.media_status,
  ARRAY['480p', '720p']::TEXT[],
  8.5,
  'David Fincher Style',
  ARRAY['Arthur Pendelton', 'Evelyn Reed', 'Daniel Craig']::TEXT[],
  false,
  'movies/midnight-anomaly/'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  release_year = EXCLUDED.release_year,
  duration_seconds = EXCLUDED.duration_seconds,
  poster_url = EXCLUDED.poster_url,
  backdrop_url = EXCLUDED.backdrop_url,
  status = EXCLUDED.status,
  renditions = EXCLUDED.renditions,
  rating = EXCLUDED.rating,
  director = EXCLUDED.director,
  cast_members = EXCLUDED.cast_members,
  featured = EXCLUDED.featured,
  r2_storage_prefix = EXCLUDED.r2_storage_prefix,
  updated_at = timezone('utc'::text, now());

-- 3. Insert Movie-Genre Mappings
INSERT INTO public.movie_genres (movie_id, genre_id)
VALUES
  ('cyber-chronicles', 'sci-fi'),
  ('cyber-chronicles', 'action'),
  ('stellar-odyssey', 'sci-fi'),
  ('shadow-velocity', 'action'),
  ('shadow-velocity', 'thriller'),
  ('the-solitary-echo', 'drama'),
  ('the-solitary-echo', 'thriller'),
  ('celestial-spirit', 'animation'),
  ('celestial-spirit', 'drama'),
  ('midnight-anomaly', 'thriller'),
  ('midnight-anomaly', 'sci-fi')
ON CONFLICT (movie_id, genre_id) DO NOTHING;
