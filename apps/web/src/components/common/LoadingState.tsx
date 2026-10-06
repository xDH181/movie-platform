import React from 'react';

interface LoadingStateProps {
  message?: string;
  variant?: 'skeleton' | 'minimal';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading presentation...', 
  variant = 'skeleton' 
}) => {
  if (variant === 'skeleton') {
    return (
      <div className="skeleton-grid-container" aria-busy="true" aria-label={message}>
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} className="skeleton-card-item">
            <div className="skeleton-poster-pulse" />
            <div className="skeleton-text-line title" />
            <div className="skeleton-text-line meta" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="minimal-loading-state" aria-busy="true" aria-label={message}>
      <div className="cinema-loading-bar" />
      <span className="loading-caption">{message}</span>
    </div>
  );
};
