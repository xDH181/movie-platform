import { Movie, Genre } from '@movie/shared';

export const MOCK_GENRES: Genre[] = [
  { id: 'all', name: 'All Movies', slug: 'all' },
  { id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi' },
  { id: 'action', name: 'Action', slug: 'action' },
  { id: 'drama', name: 'Drama', slug: 'drama' },
  { id: 'thriller', name: 'Thriller', slug: 'thriller' },
  { id: 'animation', name: 'Animation', slug: 'animation' }
];

export interface ExtendedMovie extends Movie {
  backdropUrl: string;
  rating: number;
  featured?: boolean;
  director: string;
  cast: string[];
}

export const MOCK_MOVIES: ExtendedMovie[] = [
  {
    id: 'cyber-chronicles',
    title: 'Cyber Chronicles: 2099',
    slug: 'cyber-chronicles-2099',
    description: 'In a dystopian neon metropolis, a rebellious hacker uncovers a quantum simulation that threatens humanity’s very concept of reality.',
    releaseYear: 2024,
    durationSeconds: 7440, // 2h 04m
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    rating: 8.9,
    featured: true,
    director: 'Elena Vance',
    cast: ['Devon Sato', 'Maya Lin', 'Caleb Cross'],
    genres: [{ id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi' }, { id: 'action', name: 'Action', slug: 'action' }],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'stellar-odyssey',
    title: 'Stellar Odyssey: Beyond Horizons',
    slug: 'stellar-odyssey',
    description: 'A deep-space exploratory crew encounters a gravitational rift leading to a habitable solar system with forgotten relics of an extinct civilization.',
    releaseYear: 2023,
    durationSeconds: 8880, // 2h 28m
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    rating: 9.1,
    featured: true,
    director: 'Arthur Sterling',
    cast: ['Marcus Kane', 'Chloe Valen', 'Harrison Cole'],
    genres: [{ id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi' }],
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-10T14:30:00Z'
  },
  {
    id: 'shadow-velocity',
    title: 'Shadow Velocity',
    slug: 'shadow-velocity',
    description: 'An elite undercover agent races against time across European capitals to defuse a rogue cyber-weapon before orbital satellites deploy.',
    releaseYear: 2024,
    durationSeconds: 6720, // 1h 52m
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    rating: 8.3,
    director: 'Victor Stone',
    cast: ['Liam Hunter', 'Natalia Rostova', 'Kenji Chen'],
    genres: [{ id: 'action', name: 'Action', slug: 'action' }, { id: 'thriller', name: 'Thriller', slug: 'thriller' }],
    createdAt: '2024-03-01T08:15:00Z',
    updatedAt: '2024-03-01T08:15:00Z'
  },
  {
    id: 'the-solitary-echo',
    title: 'The Solitary Echo',
    slug: 'the-solitary-echo',
    description: 'A poetic drama following an isolated lighthouse keeper in northern Norway who uncovers acoustic recordings left by his missing predecessor.',
    releaseYear: 2023,
    durationSeconds: 6180, // 1h 43m
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?w=1600&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    rating: 8.7,
    director: 'Ingrid Berg',
    cast: ['Soren Lindqvist', 'Astrid Nygard'],
    genres: [{ id: 'drama', name: 'Drama', slug: 'drama' }],
    createdAt: '2024-03-12T19:00:00Z',
    updatedAt: '2024-03-12T19:00:00Z'
  },
  {
    id: 'celestial-spirit',
    title: 'Celestial Spirit: Whispers of the Forest',
    slug: 'celestial-spirit',
    description: 'A breathtaking animated journey through an enchanted ancient realm where young guardian Rin must restore balance between humans and elemental spirits.',
    releaseYear: 2024,
    durationSeconds: 5820, // 1h 37m
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    rating: 9.3,
    director: 'Kenji Miyazaki',
    cast: ['Rin Takahashi', 'Kaelen Swift'],
    genres: [{ id: 'animation', name: 'Animation', slug: 'animation' }, { id: 'drama', name: 'Drama', slug: 'drama' }],
    createdAt: '2024-04-05T11:20:00Z',
    updatedAt: '2024-04-05T11:20:00Z'
  },
  {
    id: 'midnight-anomaly',
    title: 'Midnight Anomaly',
    slug: 'midnight-anomaly',
    description: 'A team of oceanographers discovers an uncharted deep-sea biological structure emitting electromagnetic frequencies in the Mariana Trench.',
    releaseYear: 2024,
    durationSeconds: 7080, // 1h 58m
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&auto=format&fit=crop&q=80',
    status: 'PUBLISHED',
    renditions: ['480p', '720p'],
    rating: 8.5,
    director: 'David Moreau',
    cast: ['Dr. Sarah Jenkins', 'Captain Hayes', 'Dr. Noah Bell'],
    genres: [{ id: 'thriller', name: 'Thriller', slug: 'thriller' }, { id: 'sci-fi', name: 'Sci-Fi', slug: 'sci-fi' }],
    createdAt: '2024-05-18T16:40:00Z',
    updatedAt: '2024-05-18T16:40:00Z'
  }
];

export interface MockWatchHistory {
  movieId: string;
  movie: ExtendedMovie;
  lastPositionSeconds: number;
  durationSeconds: number;
  updatedAt: string;
}

export const INITIAL_WATCH_HISTORY: MockWatchHistory[] = [
  {
    movieId: 'cyber-chronicles',
    movie: MOCK_MOVIES[0],
    lastPositionSeconds: 3200,
    durationSeconds: 7440,
    updatedAt: '2024-05-20T14:22:00Z'
  },
  {
    movieId: 'stellar-odyssey',
    movie: MOCK_MOVIES[1],
    lastPositionSeconds: 5800,
    durationSeconds: 8880,
    updatedAt: '2024-05-19T21:10:00Z'
  }
];
