import { z } from 'zod';

export const UserRoleSchema = z.enum(['USER', 'ADMIN']);

export const MediaStatusSchema = z.enum([
  'DRAFT',
  'SOURCE_READY',
  'PROCESSING',
  'READY',
  'PUBLISHED',
  'FAILED'
]);

export const VideoRenditionSchema = z.enum(['480p', '720p']);

export const GenreSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)),
  name: z.string().min(1),
  slug: z.string().min(1)
});

export const MovieQuerySchema = z.object({
  genre: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

export const CreateMovieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  releaseYear: z.number().int().min(1900).max(2100),
  durationSeconds: z.number().int().positive(),
  posterUrl: z.string().url('Poster must be a valid URL'),
  genreIds: z.array(z.string()).min(1, 'At least one genre is required')
});

export const UpdateMovieSchema = CreateMovieSchema.partial().extend({
  status: MediaStatusSchema.optional(),
  rating: z.number().min(0).max(10).optional(),
  backdropUrl: z.string().url().optional(),
  renditions: z.array(VideoRenditionSchema).optional()
});

export const UpdateWatchProgressSchema = z.object({
  movieId: z.string().min(1, 'Movie ID is required'),
  positionSeconds: z.number().min(0),
  completed: z.boolean().default(false)
});

export type CreateMovieInput = z.infer<typeof CreateMovieSchema>;
export type UpdateMovieInput = z.infer<typeof UpdateMovieSchema>;
export type UpdateWatchProgressInput = z.infer<typeof UpdateWatchProgressSchema>;

