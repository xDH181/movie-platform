import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Info, Sparkles, Flame, Clock } from 'lucide-react';
import { MOCK_MOVIES, MOCK_GENRES } from '../mock/data';
import { MovieGrid } from '../components/movie/MovieGrid';
import { MovieCard } from '../components/movie/MovieCard';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { history } = useAuth();
  const featured = MOCK_MOVIES.find(m => m.featured) || MOCK_MOVIES[0];
  const trending = MOCK_MOVIES.slice(0, 4);

  return (
    <div className="home-page-root">
      {/* Featured Hero Banner */}
      <section 
        className="hero-banner"
        style={{ backgroundImage: `url(${featured.backdropUrl})` }}
      >
        <div className="hero-gradient-overlay" />
        <div className="container hero-inner">
          <div className="hero-badge">
            <Sparkles size={14} color="#38bdf8" />
            <span>Featured Stream • Zero-Cost R2</span>
          </div>

          <h1 className="hero-headline">{featured.title}</h1>
          <p className="hero-synopsis">{featured.description}</p>

          <div className="hero-tags">
            {featured.genres.map(g => (
              <span key={g.id} className="hero-tag">{g.name}</span>
            ))}
            <span className="hero-rating">★ {featured.rating}</span>
          </div>

          <div className="hero-buttons">
            <button 
              className="btn-hero-watch"
              onClick={() => navigate(`/watch/${featured.id}`)}
            >
              <Play size={20} fill="#fff" />
              <span>Watch Now</span>
            </button>

            <Link to={`/movie/${featured.id}`} className="btn-hero-info">
              <Info size={20} />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Rows */}
      <div className="container home-content">
        {/* Continue Watching Section */}
        {history.length > 0 && (
          <section className="catalog-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <Clock size={20} color="#38bdf8" />
                <h2>Continue Watching</h2>
              </div>
              <Link to="/history" className="see-all-link">View Full History →</Link>
            </div>

            <div className="continue-watching-row">
              {history.map(item => (
                <div key={item.movieId} className="continue-card-item">
                  <MovieCard 
                    movie={item.movie} 
                    watchProgress={(item.lastPositionSeconds / item.durationSeconds) * 100}
                  />
                  <div className="resume-time-label">
                    Resumes at {Math.floor(item.lastPositionSeconds / 60)}m
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Section */}
        <section className="catalog-section">
          <div className="section-header">
            <div className="section-title-wrap">
              <Flame size={20} color="#f97316" />
              <h2>Trending Right Now</h2>
            </div>
            <Link to="/movies" className="see-all-link">Explore All Movies →</Link>
          </div>
          <MovieGrid movies={trending} />
        </section>

        {/* Browse by Genre Pills */}
        <section className="catalog-section genres-preview-section">
          <h2 style={{ marginBottom: '1.25rem', fontSize: '1.4rem' }}>Browse Categories</h2>
          <div className="genre-cards-grid">
            {MOCK_GENRES.filter(g => g.id !== 'all').map(genre => (
              <Link 
                key={genre.id} 
                to={`/movies?genre=${genre.id}`}
                className="genre-card-pill"
              >
                <span>{genre.name}</span>
                <span className="genre-count">HD Streams</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Zero-Cost Architecture Highlight Card */}
        <section className="architecture-promo-card">
          <div className="promo-text">
            <h3>⚡ Powered by Zero-Cost Architecture</h3>
            <p>
              Operates within Cloudflare Workers edge, Supabase PostgreSQL, and Cloudflare R2 object storage.
              Designed with strict 8 GB media ceiling & zero egress billing.
            </p>
          </div>
          <div className="promo-actions">
            <Link to="/admin" className="btn-secondary-sm">Open Admin Controls</Link>
          </div>
        </section>
      </div>
    </div>
  );
};
