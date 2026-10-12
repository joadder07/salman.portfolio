import { z } from 'zod';

export const createAchievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  date: z.string().datetime().optional(),
  category: z.string().optional(),
  link: z.string().url().optional(),
  order: z.number().int().optional(),
});

export const updateAchievementSchema = createAchievementSchema.partial();

export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;
