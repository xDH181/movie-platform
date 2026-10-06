import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@movie/shared';
import { INITIAL_WATCH_HISTORY, MOCK_MOVIES, MockWatchHistory } from '../mock/data';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isSupabaseLive: boolean;
  loading: boolean;
  login: (role?: UserRole) => void;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  favorites: string[];
  toggleFavorite: (movieId: string) => Promise<void>;
  isFavorite: (movieId: string) => boolean;
  history: MockWatchHistory[];
  updateHistory: (movieId: string, positionSeconds: number) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('streamzero_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-1',
      name: 'Hai Dang',
      email: 'haidangforworks@gmail.com',
      role: 'ADMIN' as UserRole,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('streamzero_favorites');
    return saved ? JSON.parse(saved) : ['cyber-chronicles', 'celestial-spirit'];
  });

  const [history, setHistory] = useState<MockWatchHistory[]>(() => {
    const saved = localStorage.getItem('streamzero_history');
    return saved ? JSON.parse(saved) : INITIAL_WATCH_HISTORY;
  });

  // 1. Sync user and session with Supabase if configured
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) {
      setLoading(false);
      return;
    }

    const initSupabaseSession = async () => {
      try {
        const { data: { session } } = await client.auth.getSession();
        if (session?.user) {
          await loadUserProfile(session.user.id, session.user.email || '');
          await loadUserUserData(session.user.id);
        }
      } catch (err) {
        console.warn('Supabase session load error, maintaining local state:', err);
      } finally {
        setLoading(false);
      }
    };

    initSupabaseSession();

    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email || '');
        await loadUserUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setFavorites([]);
        setHistory([]);
        localStorage.removeItem('streamzero_user');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string, email: string) => {
    const client = supabase;
    if (!client) return;
    try {
      const { data: profile } = await (client.from('profiles') as any)
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        const mappedUser: UserProfile = {
          id: profile.id,
          name: profile.full_name || email.split('@')[0],
          email: profile.email,
          role: profile.role || 'USER',
          avatarUrl: profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        };
        setUser(mappedUser);
        localStorage.setItem('streamzero_user', JSON.stringify(mappedUser));
      }
    } catch (e) {
      console.warn('Could not load profile from Supabase:', e);
    }
  };

  const loadUserUserData = async (userId: string) => {
    const client = supabase;
    if (!client) return;
    try {
      // Load favorites
      const { data: favs } = await (client.from('favorites') as any)
        .select('movie_id')
        .eq('user_id', userId);

      if (favs && Array.isArray(favs)) {
        const favIds = favs.map((f: any) => f.movie_id);
        setFavorites(favIds);
        localStorage.setItem('streamzero_favorites', JSON.stringify(favIds));
      }

      // Load watch history
      const { data: hist } = await (client.from('watch_history') as any)
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (hist && Array.isArray(hist) && hist.length > 0) {
        const mappedHistory: MockWatchHistory[] = hist.map((h: any) => {
          const movie = MOCK_MOVIES.find(m => m.id === h.movie_id) || MOCK_MOVIES[0];
          return {
            movieId: h.movie_id,
            movie,
            lastPositionSeconds: h.last_position_seconds || 0,
            durationSeconds: h.duration_seconds || movie.durationSeconds,
            updatedAt: h.updated_at
          };
        });
        setHistory(mappedHistory);
        localStorage.setItem('streamzero_history', JSON.stringify(mappedHistory));
      }
    } catch (e) {
      console.warn('Could not load user data from Supabase:', e);
    }
  };

  // Local persistence backups
  useEffect(() => {
    if (user) {
      localStorage.setItem('streamzero_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('streamzero_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('streamzero_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('streamzero_history', JSON.stringify(history));
  }, [history]);

  // Real Supabase Sign In
  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    const client = supabase;
    if (isSupabaseConfigured && client) {
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    }
    // Local fallback demo sign-in
    login(email.includes('admin') ? 'ADMIN' : 'USER');
    return {};
  };

  // Real Supabase Sign Up
  const signUp = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    const client = supabase;
    if (isSupabaseConfigured && client) {
      const { error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      if (error) return { error: error.message };
      return {};
    }
    // Local fallback
    login('USER');
    return {};
  };

  // Demo Switcher Login
  const login = (role: UserRole = 'USER') => {
    const mockUser: UserProfile = {
      id: role === 'ADMIN' ? 'usr-admin' : 'usr-regular',
      name: role === 'ADMIN' ? 'Admin Operator' : 'Standard Member',
      email: role === 'ADMIN' ? 'admin@streamzero.dev' : 'member@streamzero.dev',
      role: role,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    setUser(mockUser);
  };

  const logout = async () => {
    const client = supabase;
    if (isSupabaseConfigured && client) {
      await client.auth.signOut();
    }
    setUser(null);
  };

  const toggleFavorite = async (movieId: string) => {
    const willAdd = !favorites.includes(movieId);
    setFavorites(prev => willAdd ? [...prev, movieId] : prev.filter(id => id !== movieId));

    const client = supabase;
    if (isSupabaseConfigured && client && user) {
      try {
        if (willAdd) {
          await (client.from('favorites') as any).insert({
            user_id: user.id,
            movie_id: movieId
          });
        } else {
          await (client.from('favorites') as any).delete().match({
            user_id: user.id,
            movie_id: movieId
          });
        }
      } catch (err) {
        console.warn('Could not sync favorite to Supabase:', err);
      }
    }
  };

  const isFavorite = (movieId: string) => favorites.includes(movieId);

  const updateHistory = async (movieId: string, positionSeconds: number) => {
    const movie = MOCK_MOVIES.find(m => m.id === movieId);
    if (!movie) return;

    setHistory(prev => {
      const filtered = prev.filter(h => h.movieId !== movieId);
      return [
        {
          movieId,
          movie,
          lastPositionSeconds: positionSeconds,
          durationSeconds: movie.durationSeconds,
          updatedAt: new Date().toISOString()
        },
        ...filtered
      ];
    });

    const client = supabase;
    if (isSupabaseConfigured && client && user) {
      try {
        await (client.from('watch_history') as any).upsert({
          user_id: user.id,
          movie_id: movieId,
          last_position_seconds: positionSeconds,
          duration_seconds: movie.durationSeconds,
          completed: positionSeconds >= movie.durationSeconds * 0.95,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,movie_id'
        });
      } catch (err) {
        console.warn('Could not sync watch history to Supabase:', err);
      }
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    const client = supabase;
    if (isSupabaseConfigured && client && user) {
      try {
        await (client.from('watch_history') as any).delete().eq('user_id', user.id);
      } catch (err) {
        console.warn('Could not clear watch history from Supabase:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isSupabaseLive: isSupabaseConfigured,
      loading,
      login,
      logout,
      signIn,
      signUp,
      favorites,
      toggleFavorite,
      isFavorite,
      history,
      updateHistory,
      clearHistory
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
