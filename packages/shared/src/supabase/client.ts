import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types.js';

export type TypedSupabaseClient = SupabaseClient<Database>;

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

/**
 * Creates a strongly typed Supabase client with Database types
 */
export function createTypedSupabaseClient(config: SupabaseConfig): TypedSupabaseClient {
  return createClient<Database>(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}
