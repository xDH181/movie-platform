import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, Info, Sparkles, Flame, Clock, 
  ChevronRight, ChevronLeft, ShieldCheck, Zap, 
  Database, HardDrive, Volume2, VolumeX, X
} from 'lucide-react';
import gsap from 'gsap';
import { MOCK_MOVIES, MOCK_GENRES } from '../mock/data';
import { MovieGrid } from '../components/movie/MovieGrid';
import { MovieCard } from '../components/movie/MovieCard';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { history } = useAuth();
  
  // Carousel featured slides
  const featuredSlides = MOCK_MOVIES.slice(0, 3);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedHomeGenre, setSelectedHomeGenre] = useState('all');

  const heroContentRef = useRef<HTMLDivElement>(null);
  const currentMovie = featuredSlides[currentSlideIndex];

  // Auto-advance hero slides every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % featuredSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredSlides.length]);

  // GSAP animation when slide changes
  useEffect(() => {
    if (heroContentRef.current) {
      gsap.fromTo(
        heroContentRef.current.children,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [currentSlideIndex]);

  // Filter movies for trending section
  const trendingFiltered = selectedHomeGenre === 'all'
    ? MOCK_MOVIES
    : MOCK_MOVIES.filter(m => m.genres.some(g => g.id === selectedHomeGenre));

  return (
    <div className="home-page-root">
      {/* CINEMATIC INTERACTIVE HERO SPOTLIGHT */}
      <section className="hero-carousel-container">
        <div 
          className="hero-backdrop-image"
          style={{ backgroundImage: `url(${currentMovie.backdropUrl})` }}
        />
        <div className="hero-gradient-overlay" />
        <div className="hero-grid-pattern" />

        <div className="container hero-container-inner">
          <div className="hero-content-wrap" ref={heroContentRef}>
            <div className="hero-badge-row">
              <div className="hero-feature-pill">
                <Sparkles size={14} color="#38bdf8" />
                <span>Featured Spotlight #{currentSlideIndex + 1}</span>
              </div>
              <div className="hero-rendition-pill">
                <span>Adaptive HLS (720p / 480p)</span>
              </div>
            </div>

            <h1 className="hero-headline">{currentMovie.title}</h1>
            <p className="hero-synopsis">{currentMovie.description}</p>

            <div className="hero-meta-row">
              <span className="hero-rating-badge">★ {currentMovie.rating.toFixed(1)}</span>
              <span className="meta-dot">•</span>
              <span className="hero-year">{currentMovie.releaseYear}</span>
              <span className="meta-dot">•</span>
              <div className="hero-genre-list">
                {currentMovie.genres.map(g => (
                  <span key={g.id} className="hero-genre-pill">{g.name}</span>
                ))}
              </div>
            </div>

            <div className="hero-buttons-row">
              <button 
                className="btn-hero-watch"
                onClick={() => navigate(`/watch/${currentMovie.id}`)}
              >
                <div className="btn-glow-layer" />
                <Play size={20} fill="#fff" />
                <span>Stream Movie</span>
              </button>

              <button 
                className="btn-hero-trailer"
                onClick={() => setIsTrailerOpen(true)}
              >
                <Volume2 size={18} />
                <span>Preview Trailer</span>
              </button>

              <Link to={`/movie/${currentMovie.id}`} className="btn-hero-info">
                <Info size={18} />
                <span>Synopsis & Cast</span>
              </Link>
            </div>
          </div>

          {/* Interactive Slide Switcher Controls */}
          <div className="hero-slider-nav">
            <div className="slider-pills">
              {featuredSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`slide-select-btn ${idx === currentSlideIndex ? 'active' : ''}`}
                >
                  <span className="slide-num">0{idx + 1}</span>
                  <span className="slide-title-preview">{slide.title}</span>
                  {idx === currentSlideIndex && <div className="slide-progress-bar" />}
                </button>
              ))}
            </div>

            <div className="slider-arrows">
              <button 
                onClick={() => setCurrentSlideIndex((currentSlideIndex - 1 + featuredSlides.length) % featuredSlides.length)}
                className="btn-arrow"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setCurrentSlideIndex((currentSlideIndex + 1) % featuredSlides.length)}
                className="btn-arrow"
                aria-label="Next Slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ZERO-COST LIVE ARCHITECTURE DOCK */}
      <section className="container zero-dock-section">
        <div className="zero-cost-hud-bar">
          <div className="hud-badge-title">
            <Zap size={18} color="#38bdf8" />
            <div className="hud-title-col">
              <span className="hud-head">ZERO-COST ENGINE</span>
              <span className="hud-sub">Active Free-Tier Boundaries</span>
            </div>
          </div>

          <div className="hud-stats-grid">
            <div className="hud-stat-item">
              <div className="stat-icon-wrap r2">
                <ShieldCheck size={18} color="#38bdf8" />
              </div>
              <div className="stat-text">
                <span className="stat-val">$0.00 / mo</span>
                <span className="stat-lbl">Cloudflare R2 Egress</span>
              </div>
            </div>

            <div className="hud-stat-item">
              <div className="stat-icon-wrap edge">
                <HardDrive size={18} color="#34d399" />
              </div>
              <div className="stat-text">
                <span className="stat-val">&lt; 8.0 GB</span>
                <span className="stat-lbl">Safety Storage Lock</span>
              </div>
            </div>

            <div className="hud-stat-item">
              <div className="stat-icon-wrap db">
                <Database size={18} color="#a78bfa" />
              </div>
              <div className="stat-text">
                <span className="stat-val">50,000 req/mo</span>
                <span className="stat-lbl">Supabase Auth Tier</span>
              </div>
            </div>

            <div className="hud-stat-item">
              <div className="stat-icon-wrap latency">
                <Zap size={18} color="#f59e0b" />
              </div>
              <div className="stat-text">
                <span className="stat-val">&lt; 20ms Edge</span>
                <span className="stat-lbl">Cloudflare Workers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN BROWSING SECTIONS */}
      <div className="container home-content">
        {/* Continue Watching Section */}
        {history.length > 0 && (
          <section className="catalog-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <div className="section-icon-badge">
                  <Clock size={18} color="#38bdf8" />
                </div>
                <div>
                  <h2>Continue Watching</h2>
                  <p className="section-subtext">Pick up right where you paused</p>
                </div>
              </div>
              <Link to="/history" className="see-all-link">Full History →</Link>
            </div>

            <div className="continue-watching-row">
              {history.map(item => (
                <div key={item.movieId} className="continue-card-item">
                  <MovieCard 
                    movie={item.movie} 
                    watchProgress={(item.lastPositionSeconds / item.durationSeconds) * 100}
                  />
                  <div className="resume-time-pill">
                    <Play size={12} fill="#38bdf8" color="#38bdf8" />
                    <span>Resume from {Math.floor(item.lastPositionSeconds / 60)}m {item.lastPositionSeconds % 60}s</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending & Dynamic Category Filters */}
        <section className="catalog-section">
          <div className="section-header with-filters">
            <div className="section-title-wrap">
              <div className="section-icon-badge flame">
                <Flame size={18} color="#f97316" />
              </div>
              <div>
                <h2>Trending Blockbusters</h2>
                <p className="section-subtext">Optimized HLS multi-bitrate streams</p>
              </div>
            </div>

            {/* Quick Home Filter Pills */}
            <div className="home-filter-tabs">
              {MOCK_GENRES.slice(0, 5).map(genre => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedHomeGenre(genre.id)}
                  className={`home-tab-btn ${selectedHomeGenre === genre.id ? 'active' : ''}`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <MovieGrid movies={trendingFiltered} />
        </section>

        {/* Cinematic Atmosphere Categories */}
        <section className="catalog-section categories-cinematic-section">
          <div className="section-header">
            <div className="section-title-wrap">
              <div className="section-icon-badge purple">
                <Sparkles size={18} color="#c084fc" />
              </div>
              <div>
                <h2>Explore Atmospheres</h2>
                <p className="section-subtext">Tailored moods encoded in crystal clear HLS</p>
              </div>
            </div>
          </div>

          <div className="cinematic-genre-grid">
            {MOCK_GENRES.filter(g => g.id !== 'all').map((genre, idx) => {
              const bgGradients = [
                'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(56, 189, 248, 0.15))',
                'linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(168, 85, 247, 0.15))',
                'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(56, 189, 248, 0.15))',
                'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(234, 179, 8, 0.15))',
                'linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(99, 102, 241, 0.15))'
              ];
              const gradient = bgGradients[idx % bgGradients.length];

              return (
                <Link
                  key={genre.id}
                  to={`/movies?genre=${genre.id}`}
                  className="genre-cinematic-card"
                  style={{ background: gradient }}
                >
                  <div className="genre-card-glow" />
                  <div className="genre-info">
                    <span className="genre-tag-label">Category</span>
                    <h3 className="genre-title">{genre.name}</h3>
                    <span className="genre-link-action">Explore Collection →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* TRAILER PREVIEW MODAL */}
      {isTrailerOpen && (
        <div className="trailer-modal-backdrop" onClick={() => setIsTrailerOpen(false)}>
          <div className="trailer-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="trailer-modal-header">
              <div className="trailer-title-group">
                <span className="trailer-pill">CINEMA TEASER</span>
                <h3>{currentMovie.title} (Official Preview)</h3>
              </div>
              <button 
                onClick={() => setIsTrailerOpen(false)}
                className="btn-close-modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="trailer-video-stage">
              <img 
                src={currentMovie.backdropUrl} 
                alt={currentMovie.title}
                className="trailer-preview-image"
              />
              <div className="trailer-sim-overlay">
                <div className="sim-audio-bar">
                  <button onClick={() => setIsMuted(!isMuted)} className="btn-trailer-audio">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    <span>{isMuted ? 'Unmute Audio' : 'Playing 48kHz Stereo AAC'}</span>
                  </button>
                  <div className="equalizer-bars">
                    <span /><span /><span /><span />
                  </div>
                </div>
                <div className="trailer-center-notice">
                  <Play size={48} fill="#fff" className="pulse-icon" />
                  <h4>Simulated Zero-Cost HLS Teaser</h4>
                  <p>Stream direct without buffering at &lt; 2.5 Mbps</p>
                </div>
              </div>
            </div>

            <div className="trailer-modal-footer">
              <button 
                onClick={() => {
                  setIsTrailerOpen(false);
                  navigate(`/watch/${currentMovie.id}`);
                }}
                className="btn-start-full-stream"
              >
                <Play size={18} fill="#fff" />
                <span>Start Full Movie Stream</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
