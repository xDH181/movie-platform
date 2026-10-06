import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Lock, Mail, Shield, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { signIn, login, isSupabaseLive } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('admin@streamzero.dev');
  const [password, setPassword] = useState('StreamZero@2026');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const locationState = location.state as { from?: { pathname?: string } } | null;
  const from = locationState?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const result = await signIn(email, password);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (role: 'USER' | 'ADMIN') => {
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
          {isSupabaseLive ? (
            <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
              ● Supabase Auth Live Connected
            </span>
          ) : (
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              ○ Local Development Mode
            </span>
          )}
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '0.65rem 0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#f87171',
            fontSize: '0.82rem'
          }}>
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
            <button type="submit" className="btn-auth-primary" disabled={submitting}>
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
              <span>{submitting ? 'Authenticating...' : 'Sign In with Supabase'}</span>
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => handleQuickDemo('ADMIN')} 
                className="btn-auth-admin"
                style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}
                title="Quick demo access as Administrator"
              >
                <Shield size={14} />
                <span>Demo Admin</span>
              </button>
              <button 
                type="button" 
                onClick={() => handleQuickDemo('USER')} 
                className="btn-auth-admin"
                style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}
                title="Quick demo access as Regular Member"
              >
                <UserCheck size={14} />
                <span>Demo Member</span>
              </button>
            </div>
          </div>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};
