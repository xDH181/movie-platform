import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Lock, Mail, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('haidangforworks@gmail.com');
  const [password, setPassword] = useState('password123');

  const locationState = location.state as { from?: { pathname?: string } } | null;
  const from = locationState?.from?.pathname || '/';

  const handleSubmit = (e: React.FormEvent, role: 'USER' | 'ADMIN' = 'USER') => {
    e.preventDefault();
    login(role);
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-page-root">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '0.75rem' }}>
            <div className="brand-icon">
              <Film size={22} color="#fff" />
            </div>
            <span className="brand-text">Stream<span>Zero</span></span>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your streaming profile & favorites</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'USER')} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="auth-buttons-col">
            <button type="submit" className="btn-auth-primary">
              <UserCheck size={18} />
              <span>Sign In as Member (USER)</span>
            </button>

            <button 
              type="button" 
              onClick={(e) => handleSubmit(e, 'ADMIN')} 
              className="btn-auth-admin"
            >
              <Shield size={18} />
              <span>Quick Login as Admin (ADMIN)</span>
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};
