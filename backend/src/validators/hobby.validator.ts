import { z } from 'zod';

export const createHobbySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  iconUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  order: z.number().int().optional(),
});

export const updateHobbySchema = createHobbySchema.partial();

export type CreateHobbyInput = z.infer<typeof createHobbySchema>;
export type UpdateHobbyInput = z.infer<typeof updateHobbySchema>;
