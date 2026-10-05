import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Trash2, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HistoryPage: React.FC = () => {
  const { history, clearHistory } = useAuth();
  const navigate = useNavigate();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins % 60}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="container history-page-root">
      <div className="page-header">
        <div>
          <div className="header-icon-badge">
            <Clock size={20} color="#38bdf8" />
            <h1 className="page-title">Watch History</h1>
          </div>
          <p className="page-subtitle">
            Resume exactly where you left off. Watch progress syncs automatically.
          </p>
        </div>

        {history.length > 0 && (
          <button onClick={clearHistory} className="btn-clear-history">
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-favorites-box">
          <Clock size={48} color="#64748b" />
          <h3>No watch history yet</h3>
          <p>Movies you start watching will automatically appear here with saved progress.</p>
          <Link to="/movies" className="btn-primary-sm" style={{ marginTop: '1rem' }}>
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="history-list">
          {history.map(item => {
            const progressPercent = Math.min(100, (item.lastPositionSeconds / item.durationSeconds) * 100);
            return (
              <div key={item.movieId} className="history-card-item">
                <img src={item.movie.posterUrl} alt={item.movie.title} className="history-thumb" />
                <div className="history-details">
                  <h3>{item.movie.title}</h3>
                  <p className="history-meta">
                    {item.movie.releaseYear} • {item.movie.genres.map(g => g.name).join(', ')}
                  </p>
                  
                  <div className="history-progress-track">
                    <div className="history-progress-fill" style={{ width: `${progressPercent}%` }} />
                  </div>
                  
                  <div className="history-progress-stats">
                    <span>Watched: {formatTime(item.lastPositionSeconds)} / {formatTime(item.durationSeconds)}</span>
                    <span>{progressPercent.toFixed(0)}% completed</span>
                  </div>
                </div>

                <div className="history-action-col">
                  <button 
                    onClick={() => navigate(`/watch/${item.movieId}`)}
                    className="btn-resume-stream"
                  >
                    <Play size={16} fill="#fff" />
                    <span>Resume</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
