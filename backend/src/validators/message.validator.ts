import { z } from 'zod';

export const createMessageSchema = z.object({
  senderName: z.string().min(1, 'Name is required').optional(),
  senderEmail: z.string().email('Invalid email').optional(),
  subject: z.string().optional(),
  content: z.string().min(1, 'Message content is required').max(5000, 'Message is too long'),
  isAnonymous: z.boolean().optional().default(false),
}).refine(
  (data) => data.isAnonymous || (data.senderName && data.senderEmail),
  { message: 'Name and email are required for non-anonymous messages' }
);

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
