import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, Star, Clock, Calendar, Share2 } from 'lucide-react';
import { ExtendedMovie } from '../../mock/data';
import { useAuth } from '../../context/AuthContext';

interface MovieDetailProps {
  movie: ExtendedMovie;
}

export const MovieDetail: React.FC<MovieDetailProps> = ({ movie }) => {
  const { isFavorite, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const favorited = isFavorite(movie.id);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="movie-detail-root">
      {/* Backdrop Banner */}
      <div 
        className="movie-backdrop"
        style={{ backgroundImage: `url(${movie.backdropUrl})` }}
      >
        <div className="backdrop-overlay" />
      </div>

      <div className="container movie-detail-content">
        <div className="detail-layout">
          {/* Poster Column */}
          <div className="poster-col">
            <img src={movie.posterUrl} alt={movie.title} className="detail-poster" />
          </div>

          {/* Info Column */}
          <div className="info-col">
            <div className="genres-list">
              {movie.genres.map(g => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>

            <h1 className="detail-title">{movie.title}</h1>

            <div className="detail-meta-row">
              <div className="rating-badge">
                <Star size={16} fill="#eab308" color="#eab308" />
                <span>{movie.rating.toFixed(1)}</span>
              </div>
              <span className="meta-separator">•</span>
              <div className="meta-item">
                <Calendar size={15} />
                <span>{movie.releaseYear}</span>
              </div>
              <span className="meta-separator">•</span>
              <div className="meta-item">
                <Clock size={15} />
                <span>{formatDuration(movie.durationSeconds)}</span>
              </div>
              <span className="meta-separator">•</span>
              <div className="quality-pills">
                {movie.renditions.map(r => (
                  <span key={r} className="quality-pill">{r}</span>
                ))}
              </div>
            </div>

            <div className="detail-actions">
              <button 
                className="btn-watch-primary"
                onClick={() => navigate(`/watch/${movie.id}`)}
              >
                <Play size={20} fill="#fff" />
                <span>Watch Movie</span>
              </button>

              <button 
                className={`btn-fav-secondary ${favorited ? 'active' : ''}`}
                onClick={() => toggleFavorite(movie.id)}
              >
                <Heart size={18} fill={favorited ? '#ef4444' : 'none'} color={favorited ? '#ef4444' : '#fff'} />
                <span>{favorited ? 'In Favorites' : 'Add to Favorites'}</span>
              </button>

              <button 
                className="btn-share"
                onClick={() => alert(`Link copied: ${window.location.href}`)}
                title="Share link"
              >
                <Share2 size={18} />
              </button>
            </div>

            <div className="detail-synopsis">
              <h3>Synopsis</h3>
              <p>{movie.description}</p>
            </div>

            <div className="detail-credits">
              <div className="credit-item">
                <span className="credit-label">Director:</span>
                <span className="credit-val">{movie.director}</span>
              </div>
              <div className="credit-item">
                <span className="credit-label">Starring:</span>
                <span className="credit-val">{movie.cast.join(', ')}</span>
              </div>
              <div className="credit-item">
                <span className="credit-label">Stream Provider:</span>
                <span className="credit-val">Cloudflare R2 (HLS Master Manifest)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
