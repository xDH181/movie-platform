import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import { MOCK_MOVIES } from '../mock/data';
import { VideoPlayerShell } from '../components/player/VideoPlayerShell';
import { useAuth } from '../context/AuthContext';
import { ErrorState } from '../components/common/ErrorState';

export const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { history } = useAuth();
  
  const movie = MOCK_MOVIES.find(m => m.id === id);

  if (!movie) {
    return (
      <div className="container" style={{ paddingTop: '5rem' }}>
        <ErrorState
          title="Movie Not Found"
          message="Could not load the requested playback stream."
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/movies" className="btn-primary-sm">Browse Movies</Link>
        </div>
      </div>
    );
  }

  const existingHistory = history.find(h => h.movieId === movie.id);
  const initialPosition = existingHistory ? existingHistory.lastPositionSeconds : 0;
  const nextMovies = MOCK_MOVIES.filter(m => m.id !== movie.id).slice(0, 3);

  return (
    <div className="watch-page-root">
      <div className="container watch-container">
        {/* Navigation Breadcrumb */}
        <div className="watch-breadcrumb">
          <Link to={`/movie/${movie.id}`} className="back-link">
            <ChevronLeft size={18} />
            <span>Back to Movie Details</span>
          </Link>
          <span className="current-stream-title">{movie.title}</span>
        </div>

        {/* Video Player Shell */}
        <div className="player-stage-wrap">
          <VideoPlayerShell
            movieId={movie.id}
            movieTitle={movie.title}
            durationSeconds={movie.durationSeconds}
            initialPositionSeconds={initialPosition}
            posterUrl={movie.backdropUrl}
          />
        </div>

        {/* Video Metadata & Stream Diagnostics */}
        <div className="watch-details-grid">
          <div className="watch-main-info">
            <h1 className="watch-title">{movie.title} ({movie.releaseYear})</h1>
            <p className="watch-desc">{movie.description}</p>
            
            <div className="stream-diagnostics-card">
              <div className="diag-header">
                <ShieldCheck size={18} color="#34d399" />
                <h4>Playback & Storage Diagnostics (Gate 2 Mock)</h4>
              </div>
              <div className="diag-grid">
                <div className="diag-item">
                  <span className="diag-label">Manifest Source</span>
                  <span className="diag-val"><code>/playback/{movie.id}/master.m3u8</code></span>
                </div>
                <div className="diag-item">
                  <span className="diag-label">Storage Backend</span>
                  <span className="diag-val">Cloudflare R2 Standard</span>
                </div>
                <div className="diag-item">
                  <span className="diag-label">Supported Renditions</span>
                  <span className="diag-val">{movie.renditions.join(', ')} (Zero-Cost Safe Budget)</span>
                </div>
                <div className="diag-item">
                  <span className="diag-label">Sync Status</span>
                  <span className="diag-val">Throttled (every 10s & on seek)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Up Next Sidebar */}
          <div className="watch-sidebar">
            <h3 className="sidebar-title">Up Next</h3>
            <div className="up-next-list">
              {nextMovies.map(nextMovie => (
                <Link key={nextMovie.id} to={`/watch/${nextMovie.id}`} className="up-next-card">
                  <img src={nextMovie.posterUrl} alt={nextMovie.title} className="up-next-thumb" />
                  <div className="up-next-info">
                    <h4>{nextMovie.title}</h4>
                    <span className="up-next-meta">{nextMovie.releaseYear} • {nextMovie.genres[0]?.name}</span>
                    <span className="up-next-rating">★ {nextMovie.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
