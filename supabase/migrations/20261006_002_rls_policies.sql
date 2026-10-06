-- ==============================================================================
-- STREAMZERO: ZERO-COST CINEMATIC PLATFORM - SUPABASE RLS POLICIES (MIGRATION 002)
-- Strict Row Level Security ensuring zero unauthorized access
-- ==============================================================================

-- 1. Enable RLS on all relational tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- 2. Helper Function: Is the requesting user an Admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'::public.user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ==============================================================================
-- 3. PROFILES POLICIES
-- ==============================================================================
-- Anyone authenticated can view their own profile, admins can view any profile
DROP POLICY IF EXISTS "Profiles are readable by owner or admin" ON public.profiles;
CREATE POLICY "Profiles are readable by owner or admin"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update only their own profile, admins can update any
DROP POLICY IF EXISTS "Profiles are updatable by owner or admin" ON public.profiles;
CREATE POLICY "Profiles are updatable by owner or admin"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- ==============================================================================
-- 4. GENRES POLICIES
-- ==============================================================================
-- Public read for all genres
DROP POLICY IF EXISTS "Genres are readable by everyone" ON public.genres;
CREATE POLICY "Genres are readable by everyone"
  ON public.genres
  FOR SELECT
  USING (true);

-- Only admins can mutate genres
DROP POLICY IF EXISTS "Genres can only be modified by admins" ON public.genres;
CREATE POLICY "Genres can only be modified by admins"
  ON public.genres
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 5. MOVIES POLICIES
-- ==============================================================================
-- Public can read PUBLISHED movies. Admins can read all (including DRAFT, PROCESSING, FAILED).
DROP POLICY IF EXISTS "Published movies are readable by all" ON public.movies;
CREATE POLICY "Published movies are readable by all"
  ON public.movies
  FOR SELECT
  USING (status = 'PUBLISHED'::public.media_status OR public.is_admin());

-- Only admins can insert new movies
DROP POLICY IF EXISTS "Movies can only be inserted by admins" ON public.movies;
CREATE POLICY "Movies can only be inserted by admins"
  ON public.movies
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Only admins can update movies
DROP POLICY IF EXISTS "Movies can only be updated by admins" ON public.movies;
CREATE POLICY "Movies can only be updated by admins"
  ON public.movies
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete movies
DROP POLICY IF EXISTS "Movies can only be deleted by admins" ON public.movies;
CREATE POLICY "Movies can only be deleted by admins"
  ON public.movies
  FOR DELETE
  USING (public.is_admin());

-- ==============================================================================
-- 6. MOVIE_GENRES POLICIES
-- ==============================================================================
-- Public read for movie-genre associations
DROP POLICY IF EXISTS "Movie genres are readable by everyone" ON public.movie_genres;
CREATE POLICY "Movie genres are readable by everyone"
  ON public.movie_genres
  FOR SELECT
  USING (true);

-- Only admins can modify movie-genre associations
DROP POLICY IF EXISTS "Movie genres can only be modified by admins" ON public.movie_genres;
CREATE POLICY "Movie genres can only be modified by admins"
  ON public.movie_genres
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================================================
-- 7. FAVORITES POLICIES
-- ==============================================================================
-- Users can only view their own favorites
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
CREATE POLICY "Users can view their own favorites"
  ON public.favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only add to their own favorites
DROP POLICY IF EXISTS "Users can add to their own favorites" ON public.favorites;
CREATE POLICY "Users can add to their own favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only remove from their own favorites
DROP POLICY IF EXISTS "Users can remove from their own favorites" ON public.favorites;
CREATE POLICY "Users can remove from their own favorites"
  ON public.favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================================================
-- 8. WATCH_HISTORY POLICIES
-- ==============================================================================
-- Users can only view their own watch history
DROP POLICY IF EXISTS "Users can view their own watch history" ON public.watch_history;
CREATE POLICY "Users can view their own watch history"
  ON public.watch_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only record their own watch progress
DROP POLICY IF EXISTS "Users can insert their own watch progress" ON public.watch_history;
CREATE POLICY "Users can insert their own watch progress"
  ON public.watch_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own watch progress
DROP POLICY IF EXISTS "Users can update their own watch progress" ON public.watch_history;
CREATE POLICY "Users can update their own watch progress"
  ON public.watch_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own watch history
DROP POLICY IF EXISTS "Users can clear their own watch history" ON public.watch_history;
CREATE POLICY "Users can clear their own watch history"
  ON public.watch_history
  FOR DELETE
  USING (auth.uid() = user_id);
