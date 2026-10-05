import React from 'react';
import { User, Shield, Heart, Clock, HardDrive, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, favorites, history, login } = useAuth();

  if (!user) return null;

  return (
    <div className="container profile-page-root">
      <div className="profile-card-header">
        <img src={user.avatarUrl} alt={user.name} className="profile-large-avatar" />
        <div className="profile-header-info">
          <div className="name-role-row">
            <h1>{user.name}</h1>
            <span className={`role-pill ${user.role.toLowerCase()}`}>
              {user.role === 'ADMIN' ? <Shield size={14} /> : <User size={14} />}
              {user.role}
            </span>
          </div>
          <p className="profile-email">{user.email}</p>
          <div className="tier-badge">
            <CheckCircle2 size={14} color="#34d399" />
            <span>Zero-Cost Free Tier Subscriber (Active)</span>
          </div>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="stat-card">
          <Heart size={24} color="#ef4444" />
          <div className="stat-val">{favorites.length}</div>
          <div className="stat-label">Favorites Saved</div>
        </div>

        <div className="stat-card">
          <Clock size={24} color="#38bdf8" />
          <div className="stat-val">{history.length}</div>
          <div className="stat-label">Movies Watched</div>
        </div>

        <div className="stat-card">
          <HardDrive size={24} color="#a855f7" />
          <div className="stat-val">720p / 480p</div>
          <div className="stat-label">HLS Stream Quality</div>
        </div>
      </div>

      <div className="demo-switch-card">
        <h3>Role & Demo Switching</h3>
        <p>Switch between Member and Admin roles to test permissions and the Admin Portal.</p>
        
        <div className="role-switch-buttons">
          <button 
            className={`btn-switch ${user.role === 'USER' ? 'current' : ''}`}
            onClick={() => login('USER')}
          >
            Switch to Regular Member (USER)
          </button>
          
          <button 
            className={`btn-switch ${user.role === 'ADMIN' ? 'current' : ''}`}
            onClick={() => login('ADMIN')}
          >
            Switch to System Admin (ADMIN)
          </button>
        </div>
      </div>
    </div>
  );
};
