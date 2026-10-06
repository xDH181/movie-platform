import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Lock, Mail, User, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { signUp, isSupabaseLive } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const result = await signUp(email, password, name);
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
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
          <h2>Create Account</h2>
          <p>Instant access to free HD movie streams</p>
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
            <label>Full Name</label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                required
              />
            </div>
          </div>

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
                placeholder="Create a strong password"
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="free-tier-notice">
            <CheckCircle2 size={16} color="#34d399" />
            <span>100% Free Forever • No Credit Card Required</span>
          </div>

          <button type="submit" className="btn-auth-primary" disabled={submitting}>
            {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
            <span>{submitting ? 'Registering...' : 'Register & Start Streaming'}</span>
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
};
