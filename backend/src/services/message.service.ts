import prisma from '../config/db';
import { NotFoundError } from '../helpers/errors';
import type { PaginationParams } from '../helpers/pagination';

export class MessageService {
  /** List all messages (admin inbox) */
  static async findAll(params?: PaginationParams, filters?: { isRead?: boolean }) {
    const where: Record<string, unknown> = {};
    if (filters?.isRead !== undefined) where.isRead = filters.isRead;

    const [items, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...(params && { skip: params.skip, take: params.limit }),
      }),
      prisma.message.count({ where }),
    ]);

    return { items, total };
  }

  /** Send a new message (public) */
  static async create(data: {
    senderName?: string;
    senderEmail?: string;
    subject?: string;
    content: string;
    isAnonymous?: boolean;
  }) {
    // If anonymous, label sender as Anonymous and strip email
    if (data.isAnonymous) {
      data.senderName = 'Anonymous';
      data.senderEmail = undefined;
    }

    return prisma.message.create({ data });
  }

  /** Mark message as read (admin) */
  static async markAsRead(id: string) {
    const message = await prisma.message.findUnique({ where: { id } });
    if (!message) throw new NotFoundError('Message');

    return prisma.message.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /** Delete a message (admin) */
  static async delete(id: string) {
    const message = await prisma.message.findUnique({ where: { id } });
    if (!message) throw new NotFoundError('Message');

    return prisma.message.delete({ where: { id } });
  }

  /** Get unread message count (for dashboard) */
  static async getUnreadCount() {
    return prisma.message.count({ where: { isRead: false } });
  }
}
