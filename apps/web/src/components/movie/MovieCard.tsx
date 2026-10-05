import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Heart, Star, Clock, Info } from 'lucide-react';
import { ExtendedMovie } from '../../mock/data';
import { useAuth } from '../../context/AuthContext';

interface MovieCardProps {
  movie: ExtendedMovie;
  watchProgress?: number; // 0 to 100%
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, watchProgress }) => {
  const { isFavorite, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const favorited = isFavorite(movie.id);
  const [justFavorited, setJustFavorited] = useState(false);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(movie.id);
    setJustFavorited(true);
    setTimeout(() => setJustFavorited(false), 400);
  };

  return (
    <div className="movie-card-root group">
      <div className="movie-poster-wrap">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="movie-poster-img"
          loading="lazy"
        />

        {/* Ambient bottom gradient inside poster */}
        <div className="poster-inner-vignette" />

        {/* Shimmer reflection highlight */}
        <div className="poster-shimmer" />

        <div className="poster-overlay">
          <div className="poster-actions-center">
            <button 
              className="btn-play-circle"
              onClick={() => navigate(`/watch/${movie.id}`)}
              title={`Watch ${movie.title}`}
            >
              <div className="play-pulse-ring" />
              <Play size={22} fill="#fff" color="#fff" />
            </button>
            <Link 
              to={`/movie/${movie.id}`} 
              className="btn-info-quick"
              title="View Movie Details"
            >
              <Info size={16} />
              <span>Details</span>
            </Link>
          </div>
        </div>

        <button 
          className={`btn-fav-corner ${favorited ? 'active' : ''} ${justFavorited ? 'pop-anim' : ''}`}
          onClick={handleFavoriteClick}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            size={16} 
            fill={favorited ? '#ef4444' : 'none'} 
            color={favorited ? '#ef4444' : '#fff'} 
          />
        </button>

        {movie.rating && (
          <div className="rating-corner">
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="rendition-corner-badge">
          {movie.renditions.includes('720p') ? '720p HLS' : '480p HLS'}
        </div>

        {watchProgress !== undefined && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${watchProgress}%` }} />
          </div>
        )}
      </div>

      <div className="movie-info">
        <div className="movie-card-genres-row">
          {movie.genres.slice(0, 2).map(g => (
            <span key={g.id} className="card-genre-pill">{g.name}</span>
          ))}
        </div>
        <Link to={`/movie/${movie.id}`} className="movie-card-title">
          {movie.title}
        </Link>
        <div className="movie-card-meta">
          <span>{movie.releaseYear}</span>
          <span className="dot-sep">•</span>
          <span className="duration-meta">
            <Clock size={12} /> {formatDuration(movie.durationSeconds)}
          </span>
        </div>
      </div>
    </div>
  );
};
