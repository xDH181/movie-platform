import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@movie/shared';
import { INITIAL_WATCH_HISTORY, MOCK_MOVIES, MockWatchHistory } from '../mock/data';

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
  login: (role?: UserRole) => void;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (movieId: string) => void;
  isFavorite: (movieId: string) => boolean;
  history: MockWatchHistory[];
  updateHistory: (movieId: string, positionSeconds: number) => void;
  clearHistory: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('streamzero_mock_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-1',
      name: 'Hai Dang',
      email: 'haidangforworks@gmail.com',
      role: 'ADMIN',
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

  useEffect(() => {
    if (user) {
      localStorage.setItem('streamzero_mock_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('streamzero_mock_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('streamzero_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('streamzero_history', JSON.stringify(history));
  }, [history]);

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

  const logout = () => {
    setUser(null);
  };

  const toggleFavorite = (movieId: string) => {
    setFavorites(prev => 
      prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]
    );
  };

  const isFavorite = (movieId: string) => favorites.includes(movieId);

  const updateHistory = (movieId: string, positionSeconds: number) => {
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
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout,
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
