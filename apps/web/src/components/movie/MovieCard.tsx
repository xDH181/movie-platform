import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Heart, Star, Clock } from 'lucide-react';
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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="movie-card-root">
      <div className="movie-poster-wrap">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="movie-poster-img"
          loading="lazy"
        />

        <div className="poster-overlay">
          <button 
            className="btn-play-circle"
            onClick={() => navigate(`/watch/${movie.id}`)}
            title={`Watch ${movie.title}`}
          >
            <Play size={24} fill="#fff" color="#fff" />
          </button>
        </div>

        <button 
          className={`btn-fav-corner ${favorited ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie.id);
          }}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={favorited ? '#ef4444' : 'none'} color={favorited ? '#ef4444' : '#fff'} />
        </button>

        {movie.rating && (
          <div className="rating-corner">
            <Star size={12} fill="#eab308" color="#eab308" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {watchProgress !== undefined && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${watchProgress}%` }} />
          </div>
        )}
      </div>

      <div className="movie-info">
        <Link to={`/movie/${movie.id}`} className="movie-card-title">
          {movie.title}
        </Link>
        <div className="movie-card-meta">
          <span>{movie.releaseYear}</span>
          <span>•</span>
          <span className="duration-meta">
            <Clock size={12} /> {formatDuration(movie.durationSeconds)}
          </span>
          <span>•</span>
          <span className="renditions-badge">{movie.renditions.join('/')}</span>
        </div>
      </div>
    </div>
  );
};
