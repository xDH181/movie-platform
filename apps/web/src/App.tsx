import React from 'react';
import { ZERO_COST_LIMITS } from '@movie/shared';

export const App: React.FC = () => {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{
        display: 'inline-block',
        padding: '0.4rem 1rem',
        borderRadius: '9999px',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        border: '1px solid rgba(129, 140, 248, 0.3)',
        color: '#a5b4fc',
        fontSize: '0.85rem',
        fontWeight: 600,
        marginBottom: '1.5rem'
      }}>
        Gate 1 — Monorepo Foundation
      </div>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #38bdf8, #818cf8, #c084fc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem'
      }}>
        Zero-Cost Movie Streaming
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
        Production-grade streaming web platform powered by Cloudflare Workers, Supabase & R2.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>Storage Budget</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Ceiling: {(ZERO_COST_LIMITS.TARGET_STORAGE_BYTES / (1024 ** 3)).toFixed(0)} GB R2 Free Tier
          </p>
        </div>

        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>API Backend</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Cloudflare Workers + Hono (Target &lt; 30k req/day)
          </p>
        </div>

        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>Transcoding</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Local FFmpeg HLS pipeline (720p / 480p)
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
