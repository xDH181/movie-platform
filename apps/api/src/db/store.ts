import { Movie, Genre, CreateMovieInput, UpdateMovieInput, UpdateWatchProgressInput, WatchHistoryItem } from '@movie/shared';

// Initial Seed Genres
const DEFAULT_GENRES: Genre[] = [
  { id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi' },
  { id: 'action', name: 'Action', slug: 'action' },
  { id: 'drama', name: 'Drama', slug: 'drama' },
  { id: 'thriller', name: 'Thriller', slug: 'thriller' },
  { id: 'animation', name: 'Animation', slug: 'animation' },
  { id: 'documentary', name: 'Documentary', slug: 'documentary' }
];

// Initial Seed Movies
const DEFAULT_MOVIES: Movie[] = [
  {
    id: 'cyber-chronicles',
    title: 'Cyber Chronicles: 2099',
    slug: 'cyber-chronicles-2099',
    description: 'In a dystopian neon metropolis, a rebellious hacker uncovers a quantum simulation that threatens humanity’s very concept of reality.',
    releaseYear: 2024,
    durationSeconds: 7440,
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    genres: [
      { id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi' },
      { id: 'action', name: 'Action', slug: 'action' }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'stellar-odyssey',
    title: 'Stellar Odyssey: Beyond Horizons',
    slug: 'stellar-odyssey',
    description: 'A deep-space exploratory crew encounters a gravitational rift leading to a habitable solar system with forgotten relics of an extinct civilization.',
    releaseYear: 2023,
    durationSeconds: 8880,
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    genres: [
      { id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi' }
    ],
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'shadow-velocity',
    title: 'Shadow Velocity',
    slug: 'shadow-velocity',
    description: 'An elite covert operative is framed for a high-level cyber heist and must race through Tokyo’s underground to clear her name.',
    releaseYear: 2024,
    durationSeconds: 6480,
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    genres: [
      { id: 'action', name: 'Action', slug: 'action' },
      { id: 'thriller', name: 'Thriller', slug: 'thriller' }
    ],
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z'
  },
  {
    id: 'the-solitary-echo',
    title: 'The Solitary Echo',
    slug: 'the-solitary-echo',
    description: 'A reclusive sound engineer isolates himself in a coastal lighthouse only to intercept enigmatic audio broadcasts from the ocean trench.',
    releaseYear: 2023,
    durationSeconds: 6120,
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    genres: [
      { id: 'drama', name: 'Drama', slug: 'drama' },
      { id: 'thriller', name: 'Thriller', slug: 'thriller' }
    ],
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: 'celestial-spirit',
    title: 'Celestial Spirit: Whispers of the Forest',
    slug: 'celestial-spirit',
    description: 'A young botanist unearths a sacred, luminescent ecosystem guarded by ancient forest spirits facing destruction by modern industry.',
    releaseYear: 2024,
    durationSeconds: 5820,
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    genres: [
      { id: 'animation', name: 'Animation', slug: 'animation' },
      { id: 'drama', name: 'Drama', slug: 'drama' }
    ],
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z'
  },
  {
    id: 'midnight-anomaly',
    title: 'Midnight Anomaly',
    slug: 'midnight-anomaly',
    description: 'A late-night radio host receives frantic calls from across the nation reporting the same terrifying temporal anomaly in the night sky.',
    releaseYear: 2024,
    durationSeconds: 6720,
    posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    genres: [
      { id: 'thriller', name: 'Thriller', slug: 'thriller' },
      { id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi' }
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  }
];

class CatalogStore {
  private genres: Genre[] = [...DEFAULT_GENRES];
  private movies: Movie[] = [...DEFAULT_MOVIES];
  private watchHistory: Map<string, WatchHistoryItem> = new Map();
  private favorites: Map<string, Set<string>> = new Map(); // userId -> Set of movieIds

  public getGenres(): Genre[] {
    return [...this.genres];
  }

  public getMovies(params: {
    genre?: string;
    search?: string;
    page: number;
    limit: number;
    includeDrafts?: boolean;
  }): { items: Movie[]; total: number; page: number; limit: number } {
    let result = this.movies;

    if (!params.includeDrafts) {
      result = result.filter(m => m.status === 'PUBLISHED');
    }

    if (params.genre && params.genre !== 'all') {
      const gSlug = params.genre.toLowerCase();
      result = result.filter(m => m.genres.some(g => g.slug === gSlug || g.id === gSlug));
    }

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(m => 
        m.title.toLowerCase().includes(q) || 
        m.description.toLowerCase().includes(q)
      );
    }

    const total = result.length;
    const startIndex = (params.page - 1) * params.limit;
    const items = result.slice(startIndex, startIndex + params.limit);

    return {
      items,
      total,
      page: params.page,
      limit: params.limit
    };
  }

  public getMovieByIdOrSlug(idOrSlug: string): Movie | null {
    const found = this.movies.find(m => m.id === idOrSlug || m.slug === idOrSlug);
    return found ? { ...found } : null;
  }

  public createMovie(input: CreateMovieInput): Movie {
    const matchedGenres = this.genres.filter(g => input.genreIds.includes(g.id) || input.genreIds.includes(g.slug));
    
    const newMovie: Movie = {
      id: `movie-${Date.now()}`,
      title: input.title,
      slug: input.slug,
      description: input.description,
      releaseYear: input.releaseYear,
      durationSeconds: input.durationSeconds,
      posterUrl: input.posterUrl,
      status: 'PUBLISHED',
      renditions: ['480p', '720p'],
      genres: matchedGenres.length > 0 ? matchedGenres : [this.genres[0]],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.movies.unshift(newMovie);
    return newMovie;
  }

  public updateMovie(id: string, input: UpdateMovieInput): Movie | null {
    const index = this.movies.findIndex(m => m.id === id);
    if (index === -1) return null;

    const current = this.movies[index];
    let updatedGenres = current.genres;

    if (input.genreIds) {
      const matched = this.genres.filter(g => input.genreIds?.includes(g.id) || input.genreIds?.includes(g.slug));
      if (matched.length > 0) updatedGenres = matched;
    }

    const updated: Movie = {
      ...current,
      title: input.title ?? current.title,
      slug: input.slug ?? current.slug,
      description: input.description ?? current.description,
      releaseYear: input.releaseYear ?? current.releaseYear,
      durationSeconds: input.durationSeconds ?? current.durationSeconds,
      posterUrl: input.posterUrl ?? current.posterUrl,
      status: input.status ?? current.status,
      renditions: input.renditions ?? current.renditions,
      genres: updatedGenres,
      updatedAt: new Date().toISOString()
    };

    this.movies[index] = updated;
    return updated;
  }

  public deleteMovie(id: string): boolean {
    const initialLen = this.movies.length;
    this.movies = this.movies.filter(m => m.id !== id);
    return this.movies.length < initialLen;
  }

  public updateWatchProgress(userId: string, input: UpdateWatchProgressInput): WatchHistoryItem {
    const key = `${userId}:${input.movieId}`;
    const item: WatchHistoryItem = {
      id: key,
      userId,
      movieId: input.movieId,
      lastPositionSeconds: input.positionSeconds,
      completed: input.completed,
      updatedAt: new Date().toISOString()
    };
    this.watchHistory.set(key, item);
    return item;
  }

  public getUserWatchHistory(userId: string): WatchHistoryItem[] {
    return Array.from(this.watchHistory.values()).filter(h => h.userId === userId);
  }

  public getFavorites(userId: string): string[] {
    const set = this.favorites.get(userId);
    return set ? Array.from(set) : [];
  }

  public addFavorite(userId: string, movieId: string): void {
    if (!this.favorites.has(userId)) {
      this.favorites.set(userId, new Set());
    }
    this.favorites.get(userId)!.add(movieId);
  }

  public removeFavorite(userId: string, movieId: string): void {
    if (this.favorites.has(userId)) {
      this.favorites.get(userId)!.delete(movieId);
    }
  }
}

export const catalogStore = new CatalogStore();
