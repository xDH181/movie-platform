import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Heart, Star, Clock, Info } from 'lucide-react';
import { ExtendedMovie } from '../../mock/data';
import { useAuth } from '../../context/AuthContext';

interface MovieCardProps {
  movie: ExtendedMovie;
  watchProgress?: number; // 0 to 100%
  aspectRatio?: 'poster' | 'backdrop'; // 2:3 vertical or 16:9 widescreen
}

export const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  watchProgress,
  aspectRatio = 'poster'
}) => {
  const { isFavorite, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const favorited = isFavorite(movie.id);
  const [justFavorited, setJustFavorited] = useState(false);
  const [transformStyle, setTransformStyle] = useState<string>('');

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransformStyle(`perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(movie.id);
    setJustFavorited(true);
    setTimeout(() => setJustFavorited(false), 350);
  };

  const isBackdrop = aspectRatio === 'backdrop';

  return (
    <div 
      ref={cardRef}
      className={`movie-card-cell ${isBackdrop ? 'aspect-backdrop' : 'aspect-poster'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      <div className="movie-poster-frame">
        <img 
          src={isBackdrop ? movie.backdropUrl : movie.posterUrl} 
          alt={movie.title} 
          className="movie-media-image"
          loading="lazy"
        />

        {/* Film light falloff gradient */}
        <div className="poster-light-vignette" />

        {/* Action Overlay */}
        <div className="poster-hover-veil">
          <button 
            className="btn-quick-play"
            onClick={() => navigate(`/watch/${movie.id}`)}
            title={`Stream ${movie.title}`}
            aria-label={`Stream ${movie.title}`}
          >
            <Play size={20} fill="#f8fafc" color="#f8fafc" />
          </button>
          
          <Link 
            to={`/movie/${movie.id}`} 
            className="btn-quick-details"
            title="View Details"
          >
            <Info size={14} />
            <span>Details</span>
          </Link>
        </div>

        {/* Favorite Bookmark */}
        <button 
          className={`btn-fav-bookmark ${favorited ? 'active' : ''} ${justFavorited ? 'pop-anim' : ''}`}
          onClick={handleFavoriteClick}
          title={favorited ? 'Remove from favorites' : 'Save to favorites'}
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart 
            size={14} 
            fill={favorited ? '#ef4444' : 'none'} 
            color={favorited ? '#ef4444' : '#f8fafc'} 
          />
        </button>

        {/* Left Badge: Subtitle / Translation status */}
        <div className="badge-vietsub-tag">
          Vietsub
        </div>

        {/* Right Badge: Quality Format Tag */}
        <div className="format-ribbon-tag">
          {movie.renditions.includes('720p') ? 'FHD' : 'HD'}
        </div>

        {/* Rating Ribbon */}
        {movie.rating && (
          <div className="rating-pill-tag">
            <Star size={10} fill="#e5a93c" color="#e5a93c" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Watch Progress bar */}
        {watchProgress !== undefined && (
          <div className="playback-progress-track">
            <div className="playback-progress-bar" style={{ width: `${watchProgress}%` }} />
          </div>
        )}
      </div>

      <div className="movie-card-caption">
        <Link to={`/movie/${movie.id}`} className="card-movie-title" title={movie.title}>
          {movie.title}
        </Link>
        <div className="card-movie-subtitle">
          <span>{movie.title} ({movie.releaseYear})</span>
        </div>
        <div className="caption-meta-line">
          <span className="caption-genre-micro">{movie.genres[0]?.name || 'Điện Ảnh'}</span>
          <span className="meta-separator">•</span>
          <span className="caption-duration">
            <Clock size={11} /> {formatDuration(movie.durationSeconds)}
          </span>
        </div>
      </div>
    </div>
  );
};
