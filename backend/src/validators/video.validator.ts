import { z } from 'zod';

export const createVideoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  videoUrl: z.string().url('Video URL must be valid'),
  thumbnailUrl: z.string().url().optional(),
  category: z.string().optional(),
  duration: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const updateVideoSchema = createVideoSchema.partial();

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
