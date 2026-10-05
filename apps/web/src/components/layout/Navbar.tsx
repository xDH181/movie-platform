import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Shield, Menu, X, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="navbar-root">
      <div className="navbar-top-accent" />
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="brand-logo">
            <div className="brand-icon">
              <Film size={20} color="#fff" />
              <div className="brand-icon-glow" />
            </div>
            <span className="brand-text">Stream<span>Zero</span></span>
          </Link>

          <nav className="desktop-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <span>Home</span>
              {isActive('/') && <div className="nav-active-pill" />}
            </Link>
            <Link to="/movies" className={`nav-link ${isActive('/movies') ? 'active' : ''}`}>
              <span>Movies</span>
              {isActive('/movies') && <div className="nav-active-pill" />}
            </Link>
            <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>
              <span>Favorites</span>
              {isActive('/favorites') && <div className="nav-active-pill" />}
            </Link>
            <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>
              <span>History</span>
              {isActive('/history') && <div className="nav-active-pill" />}
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className={`nav-link admin-pill ${isActive('/admin') ? 'active' : ''}`}>
                <Shield size={14} /> 
                <span>Admin Hub</span>
              </Link>
            )}
          </nav>
        </div>

        <div className="navbar-right">
          {/* Live Free Tier System Status */}
          <div className="system-status-indicator" title="Streaming via Cloudflare R2 & Workers at zero egress cost">
            <span className="pulse-dot" />
            <Zap size={12} color="#34d399" />
            <span className="status-label">R2 0$ Free Tier</span>
          </div>

          <button 
            className="search-shortcut"
            onClick={() => navigate('/movies')}
            title="Search movies (Press to open catalog)"
          >
            <Search size={16} />
            <span className="search-text">Search...</span>
            <span className="search-kbd">⌘K</span>
          </button>

          {isLoggedIn && user ? (
            <div className="user-profile-menu">
              <Link to="/profile" className="profile-badge">
                <img src={user.avatarUrl} alt={user.name} className="avatar-img" />
                <span className="username">{user.name}</span>
              </Link>
              <button onClick={logout} className="btn-logout" title="Log out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/login" className="btn-text">Log in</Link>
              <Link to="/register" className="btn-primary-sm">Sign up</Link>
            </div>
          )}

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/movies" onClick={() => setMobileMenuOpen(false)}>Movies Catalog</Link>
          <Link to="/favorites" onClick={() => setMobileMenuOpen(false)}>My Favorites</Link>
          <Link to="/history" onClick={() => setMobileMenuOpen(false)}>Watch History</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#818cf8' }}>
              Admin Hub
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="btn-logout-mobile">
                Log Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-text">Log in</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary-sm">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
