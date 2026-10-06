import React from 'react';

/**
 * AmbientBackground
 * Provides an authentic cinema dark theater atmosphere:
 * - Pure obsidian depth
 * - Subtle radial film vignette
 * - No floating orbs or neon gradient soup
 */
export const AmbientBackground: React.FC = () => {
  return (
    <div className="ambient-theater-canvas" aria-hidden="true">
      <div className="theater-vignette-layer" />
    </div>
  );
};
