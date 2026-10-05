import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Shield, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="navbar-root">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="brand-logo">
            <div className="brand-icon">
              <Film size={22} color="#fff" />
            </div>
            <span className="brand-text">Stream<span>Zero</span></span>
          </Link>

          <nav className="desktop-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/movies" className={`nav-link ${isActive('/movies') ? 'active' : ''}`}>Movies</Link>
            <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>Favorites</Link>
            <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`}>History</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className={`nav-link admin-pill ${isActive('/admin') ? 'active' : ''}`}>
                <Shield size={14} /> Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="navbar-right">
          <button 
            className="search-shortcut"
            onClick={() => navigate('/movies')}
            title="Search movies"
          >
            <Search size={18} />
            <span className="search-text">Search catalog...</span>
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
              Admin Portal
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
