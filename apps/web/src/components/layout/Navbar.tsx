import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Shield, Menu, X, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  // Functional keyboard shortcut for search (⌘K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate('/movies');
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        navigate('/movies');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
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
              <span>Featured</span>
              {isActive('/') && <div className="nav-active-indicator" />}
            </Link>
            <Link to="/movies" className={`nav-link ${isActive('/movies') ? 'active' : ''}`}>
              <span>Catalog</span>
              {isActive('/movies') && <div className="nav-active-indicator" />}
            </Link>
            <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>
              <span>Favorites</span>
              {isActive('/favorites') && <div className="nav-active-indicator" />}
            </Link>
            <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
              <span>History</span>
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

          <button 
            className="search-trigger-btn"
            onClick={() => navigate('/movies')}
            title="Search movies (Press ⌘K or /)"
            aria-label="Open movie search"
          >
            <Search size={15} />
            <span className="search-placeholder">Find films...</span>
            <kbd className="search-kbd-pill">⌘K</kbd>
          </button>

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

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-drawer-sheet">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Featured Movies</Link>
          <Link to="/movies" onClick={() => setMobileMenuOpen(false)}>Catalog & Genres</Link>
          <Link to="/favorites" onClick={() => setMobileMenuOpen(false)}>Saved Favorites</Link>
          <Link to="/history" onClick={() => setMobileMenuOpen(false)}>Watch History</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#38bdf8' }}>
              Admin Studio
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn-logout-drawer">
                Log Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-nav-text">Sign In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-nav-primary">Join Free</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
