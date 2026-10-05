import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_MOVIES } from '../mock/data';
import { MovieDetail } from '../components/movie/MovieDetail';
import { MovieGrid } from '../components/movie/MovieGrid';
import { ErrorState } from '../components/common/ErrorState';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const movie = MOCK_MOVIES.find(m => m.id === id);

  if (!movie) {
    return (
      <div className="container" style={{ paddingTop: '5rem' }}>
        <ErrorState
          title="Movie Not Found"
          message={`The movie with ID "${id}" could not be located in our catalog.`}
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/movies" className="btn-primary-sm">Browse Catalog</Link>
        </div>
      </div>
    );
  }

  // Related movies by matching genres (excluding current)
  const related = MOCK_MOVIES
    .filter(m => m.id !== movie.id && m.genres.some(g => movie.genres.some(mg => mg.id === g.id)))
    .slice(0, 4);

  return (
    <div className="movie-detail-page-root">
      <MovieDetail movie={movie} />

      {related.length > 0 && (
        <div className="container" style={{ marginTop: '4rem', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>You Might Also Like</h2>
          <MovieGrid movies={related} />
        </div>
      )}
    </div>
  );
};
