import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  birthDate: z.string().datetime().optional(),
  order: z.number().int().optional(),
});

export const updatePetSchema = createPetSchema.partial();

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
