import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  coverUrl: z.string().url().optional(),
  review: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  readDate: z.string().datetime().optional(),
  genre: z.string().optional(),
  order: z.number().int().optional(),
});

export const updateBookSchema = createBookSchema.partial();

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
