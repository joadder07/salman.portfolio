import { createCrudService } from './crud.factory';
import prisma from '../config/db';
import { NotFoundError } from '../helpers/errors';
import type { CreatePhotographyInput, UpdatePhotographyInput } from '../validators/photography.validator';
import type { PaginationParams } from '../helpers/pagination';

const baseCrud = createCrudService<CreatePhotographyInput, UpdatePhotographyInput>('photography');

/** Convert tags array to comma-joined string for SQLite storage */
function serializeTags(data: any) {
  const out = { ...data };
  if (Array.isArray(out.tags)) {
    out.tags = out.tags.join(',');
  }
  return out;
}

/** Parse comma-joined tags string back to array */
function deserializePhoto(photo: any) {
  if (!photo) return photo;
  return {
    ...photo,
    tags: photo.tags
      ? photo.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [],
  };
}

export const photographyService = {
  ...baseCrud,

  /** Override create to serialize tags */
  async create(data: CreatePhotographyInput) {
    return deserializePhoto(await baseCrud.create(serializeTags(data)));
  },

  /** Override update to serialize tags */
  async update(id: string, data: UpdatePhotographyInput) {
    return deserializePhoto(await baseCrud.update(id, serializeTags(data)));
  },

  /** Override findAll to support category filtering + deserialize tags */
  async findAll(params?: PaginationParams, filters?: { category?: string; featured?: boolean }): Promise<{ items: any[]; total: number }> {
    const where: Record<string, unknown> = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.featured !== undefined) where.featured = filters.featured;

    const result = await baseCrud.findAll(params, where);
    return {
      items: (result.items as any[]).map(deserializePhoto),
      total: result.total,
    };
  },

  /** Override findById to include approved comments + deserialize tags */
  async findByIdWithComments(id: string) {
    const item = await prisma.photography.findUnique({
      where: { id },
      include: {
        comments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      throw new NotFoundError('Photography');
    }

    return deserializePhoto(item);
  },
};
