import React from 'react';
import { Genre } from '@movie/shared';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: string;
  onSelectGenre: (genreId: string) => void;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenre,
  onSelectGenre
}) => {
  return (
    <div className="genre-filter-root">
      {genres.map(genre => {
        const isSelected = selectedGenre === genre.id || (selectedGenre === '' && genre.id === 'all');
        return (
          <button
            key={genre.id}
            className={`genre-pill ${isSelected ? 'active' : ''}`}
            onClick={() => onSelectGenre(genre.id === 'all' ? '' : genre.id)}
          >
            {genre.name}
          </button>
        );
      })}
    </div>
  );
};
