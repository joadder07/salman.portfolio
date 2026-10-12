import { z } from 'zod';

export const createCommentSchema = z.object({
  authorName: z.string().min(1, 'Name is required'),
  authorEmail: z.string().email('Invalid email').optional(),
  content: z.string().min(1, 'Comment content is required').max(2000, 'Comment is too long'),
  photographyId: z.string().optional(),
  videoId: z.string().optional(),
}).refine(
  (data) => Boolean(data.photographyId || data.videoId),
  { message: 'Either photographyId or videoId must be provided' }
);

export const updateCommentStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], {
    message: 'Status must be APPROVED or REJECTED',
  }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentStatusInput = z.infer<typeof updateCommentStatusSchema>;
