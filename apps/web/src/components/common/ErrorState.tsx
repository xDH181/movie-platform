import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Unable to fetch data from the server. Please try again.',
  onRetry
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '16px',
      maxWidth: '480px',
      margin: '2rem auto',
      textAlign: 'center',
      gap: '1rem'
    }}>
      <AlertCircle size={40} color="#ef4444" />
      <div>
        <h3 style={{ color: '#f8fafc', fontSize: '1.2rem', marginBottom: '0.35rem' }}>{title}</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.2rem',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
};
