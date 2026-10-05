import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_MOVIES, MOCK_GENRES } from '../mock/data';
import { MovieGrid } from '../components/movie/MovieGrid';
import { SearchBar } from '../components/movie/SearchBar';
import { GenreFilter } from '../components/movie/GenreFilter';
import { SlidersHorizontal } from 'lucide-react';

export const MoviesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGenre = searchParams.get('genre') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [sortBy, setSortBy] = useState<'rating' | 'year' | 'title'>('rating');

  const handleSelectGenre = (genreId: string) => {
    setSelectedGenre(genreId);
    if (genreId) {
      setSearchParams({ genre: genreId });
    } else {
      setSearchParams({});
    }
  };

  const filteredMovies = useMemo(() => {
    return MOCK_MOVIES.filter(movie => {
      const matchesSearch = searchQuery === '' || 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGenre = selectedGenre === '' || 
        movie.genres.some(g => g.slug === selectedGenre);

      return matchesSearch && matchesGenre;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'year') return b.releaseYear - a.releaseYear;
      return a.title.localeCompare(b.title);
    });
  }, [searchQuery, selectedGenre, sortBy]);

  return (
    <div className="container movies-page-root">
      <div className="page-header">
        <div>
          <h1 className="page-title">Movie Catalog</h1>
          <p className="page-subtitle">
            Browse our curated collection of high-definition HLS streams.
          </p>
        </div>

        <div className="sort-wrapper">
          <SlidersHorizontal size={16} />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'year' | 'title')}
            className="sort-select"
          >
            <option value="rating">Highest Rated</option>
            <option value="year">Newest Releases</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="filters-toolbar">
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          placeholder="Search movies by title, actor, director..."
        />
        <GenreFilter
          genres={MOCK_GENRES}
          selectedGenre={selectedGenre}
          onSelectGenre={handleSelectGenre}
        />
      </div>

      <div className="results-count-bar">
        <span>Showing <strong>{filteredMovies.length}</strong> {filteredMovies.length === 1 ? 'movie' : 'movies'}</span>
        {(searchQuery || selectedGenre) && (
          <button 
            className="btn-reset-filters"
            onClick={() => { setSearchQuery(''); handleSelectGenre(''); }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <MovieGrid 
        movies={filteredMovies} 
        emptyMessage="No movies match your search or genre filter. Try adjusting your search term."
      />
    </div>
  );
};
