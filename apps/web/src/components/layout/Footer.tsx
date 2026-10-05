import React from 'react';
import { Film, ShieldCheck, Zap, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-root">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="brand-logo">
            <div className="brand-icon">
              <Film size={18} color="#fff" />
            </div>
            <span className="brand-text">Stream<span>Zero</span></span>
          </div>
          <p className="footer-desc">
            High-performance, modern movie streaming platform engineered to run at $0/month within free tier boundaries.
          </p>
        </div>

        <div className="footer-badges">
          <div className="badge-item">
            <Zap size={16} color="#38bdf8" />
            <span>Cloudflare Workers + Pages</span>
          </div>
          <div className="badge-item">
            <Database size={16} color="#34d399" />
            <span>Supabase Auth & DB</span>
          </div>
          <div className="badge-item">
            <ShieldCheck size={16} color="#a78bfa" />
            <span>Cloudflare R2 Object Storage</span>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StreamZero. Zero-Cost Movie Streaming Architecture.</p>
          <div className="footer-links">
            <span>Gate 2: UI/UX Skeleton</span>
            <span>•</span>
            <span>HLS Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
