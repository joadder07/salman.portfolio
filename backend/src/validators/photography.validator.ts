import { z } from 'zod';

export const createPhotographySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Image URL must be valid'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const updatePhotographySchema = createPhotographySchema.partial();

export type CreatePhotographyInput = z.infer<typeof createPhotographySchema>;
export type UpdatePhotographyInput = z.infer<typeof updatePhotographySchema>;
