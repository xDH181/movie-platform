import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { MOCK_MOVIES } from '../mock/data';
import { MovieGrid } from '../components/movie/MovieGrid';
import { useAuth } from '../context/AuthContext';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useAuth();
  
  const favoritedMovies = MOCK_MOVIES.filter(m => favorites.includes(m.id));

  return (
    <div className="container favorites-page-root">
      <div className="page-header">
        <div>
          <div className="header-icon-badge">
            <Heart size={20} color="#ef4444" fill="#ef4444" />
            <h1 className="page-title">My Favorite Movies</h1>
          </div>
          <p className="page-subtitle">
            All your saved movies ready for immediate streaming.
          </p>
        </div>
        <span className="results-count"><strong>{favoritedMovies.length}</strong> Saved</span>
      </div>

      {favoritedMovies.length === 0 ? (
        <div className="empty-favorites-box">
          <Heart size={48} color="#64748b" />
          <h3>Your favorites list is currently empty</h3>
          <p>Click the heart icon on any movie card or detail page to save it here.</p>
          <Link to="/movies" className="btn-primary-sm" style={{ marginTop: '1rem' }}>
            Explore Catalog
          </Link>
        </div>
      ) : (
        <MovieGrid movies={favoritedMovies} />
      )}
    </div>
  );
};
