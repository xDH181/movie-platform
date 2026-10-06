import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, Info, Clock, 
  ChevronRight, ChevronLeft, ShieldCheck, Zap, 
  Database, HardDrive, Volume2, VolumeX, X, Star
} from 'lucide-react';
import gsap from 'gsap';
import { MOCK_MOVIES, MOCK_GENRES } from '../mock/data';
import { MovieCard } from '../components/movie/MovieCard';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { history } = useAuth();
  
  // Featured spotlight slides
  const spotlightSlides = MOCK_MOVIES.slice(0, 3);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isTeaserOpen, setIsTeaserOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');

  const heroDetailsRef = useRef<HTMLDivElement>(null);
  const activeMovie = spotlightSlides[slideIndex];

  // Auto-advance spotlight every 9 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % spotlightSlides.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [spotlightSlides.length]);

  // GSAP subtle content reveal when slide changes
  useEffect(() => {
    if (heroDetailsRef.current) {
      gsap.fromTo(
        heroDetailsRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.06, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, [slideIndex]);

  // Filter trending films
  const trendingMovies = selectedGenre === 'all'
    ? MOCK_MOVIES
    : MOCK_MOVIES.filter(m => m.genres.some(g => g.id === selectedGenre));

  return (
    <div className="home-screen-root">
      {/* 1. CINEMASCOPE FEATURED SPOTLIGHT */}
      <section className="cinemascope-hero-stage" aria-label="Featured Film Spotlight">
        {/* Layered Backdrop Image with authentic cinema vignette */}
        <div 
          className="hero-film-backdrop"
          style={{ backgroundImage: `url(${activeMovie.backdropUrl})` }}
        />
        <div className="hero-atmosphere-mask" />
        <div className="hero-film-grain" />

        <div className="container hero-stage-container">
          <div className="hero-stage-content" ref={heroDetailsRef}>
            {/* Spotlight metadata tag */}
            <div className="spotlight-tag-row">
              <span className="spotlight-pill">PREMIERE SPOTLIGHT</span>
              <span className="spotlight-counter">0{slideIndex + 1} / 0{spotlightSlides.length}</span>
              <span className="spotlight-codec-tag">Adaptive HLS Dual Rendition</span>
            </div>

            {/* Cinematic Title */}
            <h1 className="hero-title-headline">{activeMovie.title}</h1>

            {/* Synopsis */}
            <p className="hero-synopsis-logline">{activeMovie.description}</p>

            {/* Supporting Information Meta */}
            <div className="hero-supporting-meta">
              <div className="film-rating-badge">
                <Star size={13} fill="#e5a93c" color="#e5a93c" />
                <span>{activeMovie.rating.toFixed(1)}</span>
              </div>
              <span className="meta-bullet">•</span>
              <span className="meta-year-badge">{activeMovie.releaseYear}</span>
              <span className="meta-bullet">•</span>
              <span className="meta-duration-badge">{Math.floor(activeMovie.durationSeconds / 60)} min</span>
              <span className="meta-bullet">•</span>
              <div className="hero-genres-chips">
                {activeMovie.genres.map(g => (
                  <span key={g.id} className="genre-chip-item">{g.name}</span>
                ))}
              </div>
            </div>

            {/* Action Group */}
            <div className="hero-actions-cluster">
              <button 
                className="btn-cinema-watch"
                onClick={() => navigate(`/watch/${activeMovie.id}`)}
                aria-label={`Stream ${activeMovie.title}`}
              >
                <Play size={18} fill="#fff" />
                <span>Stream Film</span>
              </button>

              <button 
                className="btn-cinema-teaser"
                onClick={() => setIsTeaserOpen(true)}
                aria-label="Preview Film Teaser"
              >
                <Volume2 size={16} />
                <span>Teaser Preview</span>
              </button>

              <Link 
                to={`/movie/${activeMovie.id}`} 
                className="btn-cinema-synopsis"
                aria-label={`View full details for ${activeMovie.title}`}
              >
                <Info size={16} />
                <span>Cast & Specs</span>
              </Link>
            </div>
          </div>

          {/* Minimalist Slide Selector Tabs */}
          <div className="hero-bottom-navigator">
            <div className="slide-tab-group">
              {spotlightSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setSlideIndex(idx)}
                  className={`slide-tab-pill ${idx === slideIndex ? 'active' : ''}`}
                  aria-label={`Switch to slide ${idx + 1}: ${slide.title}`}
                >
                  <span className="slide-tab-num">0{idx + 1}</span>
                  <span className="slide-tab-title">{slide.title}</span>
                  {idx === slideIndex && <div className="slide-active-tracer" />}
                </button>
              ))}
            </div>

            <div className="slide-direction-arrows">
              <button 
                onClick={() => setSlideIndex((slideIndex - 1 + spotlightSlides.length) % spotlightSlides.length)}
                className="btn-arrow-control"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => setSlideIndex((slideIndex + 1) % spotlightSlides.length)}
                className="btn-arrow-control"
                aria-label="Next Slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ARCHITECTURAL ZERO-COST ENGINE TELEMETRY BAR */}
      <section className="container engine-telemetry-section" aria-label="Zero-Cost Architecture Status">
        <div className="engine-telemetry-ribbon">
          <div className="telemetry-brand-block">
            <div className="brand-dot-pulse" />
            <div className="telemetry-brand-text">
              <span className="telemetry-head">ZERO-COST RUNTIME</span>
              <span className="telemetry-sub">Cloudflare R2 + Workers</span>
            </div>
          </div>

          <div className="telemetry-metrics-grid">
            <div className="metric-cell">
              <ShieldCheck size={16} color="#38bdf8" />
              <div className="metric-info">
                <span className="metric-value">$0.00 / mo</span>
                <span className="metric-label">R2 Egress Billing</span>
              </div>
            </div>

            <div className="metric-cell">
              <HardDrive size={16} color="#10b981" />
              <div className="metric-info">
                <span className="metric-value">&lt; 8.0 GB</span>
                <span className="metric-label">Safe Storage Ceiling</span>
              </div>
            </div>

            <div className="metric-cell">
              <Zap size={16} color="#e5a93c" />
              <div className="metric-info">
                <span className="metric-value">~14ms</span>
                <span className="metric-label">Edge Cache Latency</span>
              </div>
            </div>

            <div className="metric-cell">
              <Database size={16} color="#94a3b8" />
              <div className="metric-info">
                <span className="metric-value">Adaptive HLS</span>
                <span className="metric-label">720p / 480p Bitrates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTENT RAILS */}
      <div className="container home-rail-container">
        {/* Continue Watching Rail (Widescreen 16:9 cards) */}
        {history.length > 0 && (
          <section className="catalog-rail-block" aria-label="Continue Watching">
            <div className="rail-heading-row">
              <div className="rail-title-group">
                <Clock size={18} color="#38bdf8" />
                <h2>Continue Watching</h2>
              </div>
              <Link to="/history" className="rail-see-all">History ({history.length}) →</Link>
            </div>

            <div className="continue-widescreen-grid">
              {history.map(item => (
                <div key={item.movieId} className="continue-item-cell">
                  <MovieCard 
                    movie={item.movie} 
                    watchProgress={(item.lastPositionSeconds / item.durationSeconds) * 100}
                    aspectRatio="backdrop"
                  />
                  <div className="continue-time-indicator">
                    <span className="resume-timecode">
                      Resumes at {Math.floor(item.lastPositionSeconds / 60)}m {item.lastPositionSeconds % 60}s
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Curated Cinema Rail (2:3 Vertical Posters with Genre Chips) */}
        <section className="catalog-rail-block" aria-label="Trending Catalog">
          <div className="rail-heading-row with-filters">
            <div className="rail-title-group">
              <Star size={18} color="#e5a93c" fill="#e5a93c" />
              <h2>Curated Cinema</h2>
            </div>

            {/* Genre Filter Tabs */}
            <div className="rail-filter-pills" role="tablist">
              {MOCK_GENRES.slice(0, 5).map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  className={`rail-filter-pill ${selectedGenre === g.id ? 'active' : ''}`}
                  role="tab"
                  aria-selected={selectedGenre === g.id}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          <div className="movie-poster-grid">
            {trendingMovies.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                aspectRatio="poster"
              />
            ))}
          </div>
        </section>

        {/* Cinema Atmospheres (Category Tiles) */}
        <section className="catalog-rail-block atmospheres-block" aria-label="Browse Atmospheres">
          <div className="rail-heading-row">
            <div className="rail-title-group">
              <h2>Atmospheres & Genres</h2>
            </div>
          </div>

          <div className="atmosphere-cards-grid">
            {MOCK_GENRES.filter(g => g.id !== 'all').map(genre => (
              <Link
                key={genre.id}
                to={`/movies?genre=${genre.id}`}
                className="atmosphere-tile-link"
              >
                <div className="atmosphere-tile-inner">
                  <span className="tile-category-tag">Collection</span>
                  <h3 className="tile-category-name">{genre.name}</h3>
                  <span className="tile-action-arrow">Browse Titles →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 4. TEASER PREVIEW MODAL */}
      {isTeaserOpen && (
        <div 
          className="teaser-dialog-overlay" 
          onClick={() => setIsTeaserOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Teaser preview for ${activeMovie.title}`}
        >
          <div className="teaser-dialog-window" onClick={(e) => e.stopPropagation()}>
            <div className="teaser-window-header">
              <div className="teaser-heading-info">
                <span className="teaser-film-pill">OFFICIAL TEASER</span>
                <h3>{activeMovie.title}</h3>
              </div>
              <button 
                onClick={() => setIsTeaserOpen(false)}
                className="btn-teaser-close"
                aria-label="Close Teaser"
              >
                <X size={18} />
              </button>
            </div>

            <div className="teaser-letterbox-stage">
              <img 
                src={activeMovie.backdropUrl} 
                alt={activeMovie.title}
                className="teaser-frame-visual"
              />
              <div className="teaser-playback-hud">
                <div className="audio-control-bar">
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="btn-audio-toggle"
                    aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    <span>{isMuted ? 'Audio Muted' : 'Stereo 48kHz Active'}</span>
                  </button>
                </div>

                <div className="teaser-center-action">
                  <button 
                    onClick={() => {
                      setIsTeaserOpen(false);
                      navigate(`/watch/${activeMovie.id}`);
                    }}
                    className="btn-teaser-play-full"
                  >
                    <Play size={22} fill="#fff" />
                    <span>Watch Full Film in HLS</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
