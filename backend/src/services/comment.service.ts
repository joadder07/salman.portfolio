import prisma from '../config/db';
import { NotFoundError } from '../helpers/errors';
import type { PaginationParams } from '../helpers/pagination';
import type { CommentStatus } from '@prisma/client';

export class CommentService {
  /** List all comments (admin) — filterable by status */
  static async findAll(params?: PaginationParams, filters?: { status?: CommentStatus }) {
    const where: Record<string, unknown> = {};
    if (filters?.status) where.status = filters.status;

    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...(params && { skip: params.skip, take: params.limit }),
        include: {
          photography: { select: { id: true, title: true } },
          video: { select: { id: true, title: true } },
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return { items, total };
  }

  /** Submit a new comment (public) */
  static async create(data: {
    authorName: string;
    authorEmail?: string;
    content: string;
    photographyId?: string;
    videoId?: string;
  }) {
    return prisma.comment.create({ data });
  }

  /** Update comment status (admin) */
  static async updateStatus(id: string, status: CommentStatus) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundError('Comment');

    return prisma.comment.update({
      where: { id },
      data: { status },
    });
  }

  /** Delete a comment (admin) */
  static async delete(id: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundError('Comment');

    return prisma.comment.delete({ where: { id } });
  }

  /** Get count of pending comments (for dashboard) */
  static async getPendingCount() {
    return prisma.comment.count({ where: { status: 'PENDING' } });
  }
}
