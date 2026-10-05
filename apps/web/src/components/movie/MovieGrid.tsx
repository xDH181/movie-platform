import React from 'react';
import { ExtendedMovie } from '../../mock/data';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: ExtendedMovie[];
  emptyMessage?: string;
}

export const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies, 
  emptyMessage = 'No movies found matching your criteria.' 
}) => {
  if (movies.length === 0) {
    return (
      <div className="grid-empty-state">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="movie-grid-container">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};
