import { MediaStatus, UserRole } from '../types/index.js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      genres: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      movies: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          release_year: number;
          duration_seconds: number;
          poster_url: string;
          backdrop_url: string | null;
          status: MediaStatus;
          renditions: string[];
          rating: number;
          director: string | null;
          cast_members: string[];
          featured: boolean;
          r2_storage_prefix: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          title: string;
          slug: string;
          description: string;
          release_year: number;
          duration_seconds: number;
          poster_url: string;
          backdrop_url?: string | null;
          status?: MediaStatus;
          renditions?: string[];
          rating?: number;
          director?: string | null;
          cast_members?: string[];
          featured?: boolean;
          r2_storage_prefix?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          release_year?: number;
          duration_seconds?: number;
          poster_url?: string;
          backdrop_url?: string | null;
          status?: MediaStatus;
          renditions?: string[];
          rating?: number;
          director?: string | null;
          cast_members?: string[];
          featured?: boolean;
          r2_storage_prefix?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      movie_genres: {
        Row: {
          movie_id: string;
          genre_id: string;
          created_at: string;
        };
        Insert: {
          movie_id: string;
          genre_id: string;
          created_at?: string;
        };
        Update: {
          movie_id?: string;
          genre_id?: string;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          movie_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          movie_id?: string;
          created_at?: string;
        };
      };
      watch_history: {
        Row: {
          id: string;
          user_id: string;
          movie_id: string;
          last_position_seconds: number;
          duration_seconds: number;
          completed: boolean;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: string;
          last_position_seconds?: number;
          duration_seconds?: number;
          completed?: boolean;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          movie_id?: string;
          last_position_seconds?: number;
          duration_seconds?: number;
          completed?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      media_status: MediaStatus;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
