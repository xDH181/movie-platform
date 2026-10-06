import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Shield, Menu, X, LogOut, CheckCircle2, Play, Star, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_MOVIES } from '../../mock/data';

export const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Filter movies live based on search query
  const filteredMovies = searchQuery.trim()
    ? MOCK_MOVIES.filter(m => {
        const q = searchQuery.toLowerCase().trim();
        return (
          m.title.toLowerCase().includes(q) ||
          m.slug.toLowerCase().includes(q) ||
          m.genres.some(g => g.name.toLowerCase().includes(q) || g.slug.toLowerCase().includes(q)) ||
          m.description.toLowerCase().includes(q) ||
          m.cast.some(c => c.toLowerCase().includes(q)) ||
          (q.includes('cyber') && m.title.toLowerCase().includes('cyber'))
        );
      })
    : [];

  // Functional keyboard shortcut for search (⌘K or / or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  const handleSelectMovie = (movieId: string, watchDirectly = false) => {
    setSearchOpen(false);
    if (watchDirectly) {
      navigate(`/watch/${movieId}`);
    } else {
      navigate(`/movie/${movieId}`);
    }
  };

  return (
    <>
      <header className="navbar-root">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="brand-logo" aria-label="StreamZero Home">
              <div className="brand-mark">
                <Film size={18} color="#f8fafc" />
              </div>
              <span className="brand-text">Stream<span className="brand-text-accent">Zero</span></span>
            </Link>

            <nav className="desktop-nav" aria-label="Main Navigation">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                <span>Trang Chủ</span>
                {isActive('/') && <div className="nav-active-indicator" />}
              </Link>
              <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
                <span>Lịch Sử Xem</span>
                {isActive('/history') && <div className="nav-active-indicator" />}
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className={`nav-link admin-link-pill ${isActive('/admin') ? 'active' : ''}`}>
                  <Shield size={13} />
                  <span>Admin Studio</span>
                </Link>
              )}
            </nav>
          </div>

          <div className="navbar-right">
            {/* Subtle architectural system status indicator */}
            <div className="system-status-ribbon" title="Streaming via Cloudflare R2 & Workers at zero egress cost">
              <span className="status-dot-emerald" />
              <span className="status-label">R2 Zero Egress</span>
              <CheckCircle2 size={13} color="#10b981" />
            </div>

            {/* Direct In-Place Search Trigger */}
            <button 
              className="search-trigger-btn"
              onClick={() => setSearchOpen(true)}
              title="Tìm kiếm phim trực tiếp (Phím ⌘K hoặc /)"
              aria-label="Mở tìm kiếm phim trực tiếp"
            >
              <Search size={15} />
              <span className="search-placeholder">Tìm kiếm phim...</span>
              <kbd className="search-kbd-pill">⌘K</kbd>
            </button>

            <div className="desktop-auth-wrap">
              {isLoggedIn && user ? (
                <div className="user-profile-menu">
                  <Link to="/profile" className="profile-pill-badge" title="View profile">
                    <img src={user.avatarUrl} alt={user.name} className="avatar-round" />
                    <span className="user-display-name">{user.name}</span>
                  </Link>
                  <button onClick={logout} className="btn-icon-logout" title="Log out" aria-label="Log out">
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <div className="auth-actions-group">
                  <Link to="/login" className="btn-nav-text">Sign In</Link>
                  <Link to="/register" className="btn-nav-primary">Join Free</Link>
                </div>
              )}
            </div>

            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-drawer-sheet">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang Chủ (Phim Mới)</Link>
            <Link to="/history" onClick={() => setMobileMenuOpen(false)}>Lịch Sử Xem Phim</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#38bdf8' }}>
                Admin Studio (Quản Trị)
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Tài Khoản Của Tôi</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn-logout-drawer">
                  Đăng Xuất
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-nav-text">Đăng Nhập</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-nav-primary">Tạo Tài Khoản</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* DIRECT IN-PLACE LIVE SEARCH MODAL (Spotlight Palette) */}
      {searchOpen && (
        <div className="live-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="live-search-modal" onClick={e => e.stopPropagation()}>
            {/* Input Bar */}
            <div className="live-search-input-wrap">
              <Search size={18} className="live-search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="live-search-field"
                placeholder="Tìm tên phim, thể loại (ví dụ: Cyberpunk, Sci-Fi)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoComplete="off"
              />
              {searchQuery && (
                <button 
                  className="btn-clear-search" 
                  onClick={() => setSearchQuery('')}
                  aria-label="Xóa nội dung tìm kiếm"
                >
                  <X size={15} />
                </button>
              )}
              <kbd className="live-search-esc-hint" onClick={() => setSearchOpen(false)}>ESC</kbd>
            </div>

            {/* Quick Filter Tags when empty query */}
            {!searchQuery && (
              <div className="search-quick-tags">
                <span className="quick-tags-label">Gợi ý tìm nhanh:</span>
                {['Cyberpunk', 'Sci-Fi', 'Action', 'Drama', 'Thriller', 'Animation'].map(tag => (
                  <button 
                    key={tag}
                    className="btn-quick-tag"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Live Search Results List */}
            <div className="live-search-results-list">
              {searchQuery && filteredMovies.length === 0 && (
                <div className="search-empty-state">
                  <Film size={32} color="#64748b" />
                  <p>Không tìm thấy phim nào khớp với "<strong>{searchQuery}</strong>"</p>
                  <span className="search-empty-sub">Hãy thử từ khóa khác như tên tiếng Anh hoặc thể loại phim.</span>
                </div>
              )}

              {filteredMovies.map(movie => (
                <div 
                  key={movie.id} 
                  className="search-result-item"
                  onClick={() => handleSelectMovie(movie.id)}
                >
                  <img src={movie.posterUrl} alt={movie.title} className="search-result-thumb" />
                  
                  <div className="search-result-info">
                    <div className="search-result-title-row">
                      <h4 className="search-result-title">{movie.title}</h4>
                      <div className="search-result-badges">
                        <span className="search-badge-format">
                          {movie.renditions.includes('720p') ? 'FHD' : 'HD'}
                        </span>
                        <span className="search-badge-rating">
                          <Star size={11} fill="#e5a93c" color="#e5a93c" />
                          {movie.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="search-result-desc">{movie.description}</p>
                    
                    <div className="search-result-meta">
                      <span className="search-meta-pill">{movie.genres[0]?.name || 'Điện Ảnh'}</span>
                      <span className="search-meta-dot">•</span>
                      <span>{movie.releaseYear}</span>
                      <span className="search-meta-dot">•</span>
                      <span className="search-meta-duration">
                        <Clock size={11} />
                        {Math.floor(movie.durationSeconds / 3600)}h {Math.floor((movie.durationSeconds % 3600) / 60)}m
                      </span>
                    </div>
                  </div>

                  <div className="search-result-actions" onClick={e => e.stopPropagation()}>
                    <button 
                      className="btn-search-stream"
                      onClick={() => handleSelectMovie(movie.id, true)}
                      title={`Xem phim ${movie.title}`}
                    >
                      <Play size={13} fill="#07080b" />
                      <span>Xem</span>
                    </button>
                    <button 
                      className="btn-search-details"
                      onClick={() => handleSelectMovie(movie.id, false)}
                      title="Chi tiết phim"
                    >
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
