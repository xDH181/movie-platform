/// <reference types="vite/client" />
import { createTypedSupabaseClient, TypedSupabaseClient } from '@movie/shared';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

/**
 * Singleton Supabase client instance.
 * Returns null if Supabase environment variables are missing (in mock/offline mode).
 */
export const supabase: TypedSupabaseClient | null = isSupabaseConfigured
  ? createTypedSupabaseClient({
      supabaseUrl,
      supabaseAnonKey
    })
  : null;
