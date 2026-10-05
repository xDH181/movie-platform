export type UserRole = 'USER' | 'ADMIN';

export type MediaStatus = 
  | 'DRAFT' 
  | 'SOURCE_READY' 
  | 'PROCESSING' 
  | 'READY' 
  | 'PUBLISHED' 
  | 'FAILED';

export type VideoRendition = '480p' | '720p';

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  description: string;
  releaseYear: number;
  durationSeconds: number;
  posterUrl: string;
  status: MediaStatus;
  renditions: VideoRendition[];
  genres: Genre[];
  createdAt: string;
  updatedAt: string;
}

export interface WatchHistoryItem {
  id: string;
  userId: string;
  movieId: string;
  lastPositionSeconds: number;
  completed: boolean;
  updatedAt: string;
}

export interface FavoriteItem {
  userId: string;
  movieId: string;
  createdAt: string;
}

export interface PlaybackSession {
  movieId: string;
  manifestUrl: string;
  token: string;
  expiresAt: number;
}
