import { z } from 'zod';

export const createArtSchema = z.object({
  title: z.string().min(1, 'Artwork title is required'),
  medium: z.string().optional(),
  year: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  palette: z.string().optional(),
  order: z.number().int().optional(),
});

export const updateArtSchema = createArtSchema.partial();

export type CreateArtInput = z.infer<typeof createArtSchema>;
export type UpdateArtInput = z.infer<typeof updateArtSchema>;
