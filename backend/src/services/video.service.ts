import { createCrudService } from './crud.factory';
import prisma from '../config/db';
import { NotFoundError } from '../helpers/errors';
import type { CreateVideoInput, UpdateVideoInput } from '../validators/video.validator';
import type { PaginationParams } from '../helpers/pagination';

const baseCrud = createCrudService<CreateVideoInput, UpdateVideoInput>('video');

export const videoService = {
  ...baseCrud,

  /** Override findAll to support category filtering */
  async findAll(params?: PaginationParams, filters?: { category?: string; featured?: boolean }) {
    const where: Record<string, unknown> = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.featured !== undefined) where.featured = filters.featured;

    return baseCrud.findAll(params, where);
  },

  /** Override findById to include approved comments */
  async findByIdWithComments(id: string) {
    const item = await prisma.video.findUnique({
      where: { id },
      include: {
        comments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      throw new NotFoundError('Video');
    }

    return item;
  },
};
