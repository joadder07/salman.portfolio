import { z } from 'zod';

const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}/i;

export const createVideoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  videoUrl: z
    .string()
    .min(1, 'YouTube video URL is required')
    .refine((url) => YOUTUBE_REGEX.test(url.trim()), {
      message: 'Only valid YouTube video links are allowed (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)',
    }),
  thumbnailUrl: z.string().optional(),
  category: z.string().optional(),
  duration: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const updateVideoSchema = createVideoSchema.partial();

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type UpdateVideoInput = z.infer<typeof updateVideoSchema>;
