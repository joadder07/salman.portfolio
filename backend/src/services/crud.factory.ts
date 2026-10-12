import prisma from '../config/db';
import { NotFoundError } from '../helpers/errors';
import type { PaginationParams } from '../helpers/pagination';

type PrismaModelName = 'education' | 'photography' | 'video' | 'hobby' | 'pet' | 'book' | 'achievement' | 'art';

/**
 * Generic CRUD service factory for entities with standard create/read/update/delete operations.
 * Each entity has an `order` field for sorting and standard timestamps.
 */
export function createCrudService<TCreate, TUpdate>(modelName: PrismaModelName) {
  // Get the prisma delegate dynamically
  const getModel = () => (prisma as any)[modelName];

  return {
    async findAll(params?: PaginationParams, filters?: Record<string, unknown>) {
      const model = getModel();
      const where = filters || {};

      if (params) {
        const [items, total] = await Promise.all([
          model.findMany({
            where,
            orderBy: { order: 'asc' },
            skip: params.skip,
            take: params.limit,
          }),
          model.count({ where }),
        ]);
        return { items, total };
      }

      const items = await model.findMany({
        where,
        orderBy: { order: 'asc' },
      });
      return { items, total: items.length };
    },

    async findById(id: string, include?: Record<string, unknown>) {
      const model = getModel();
      const item = await model.findUnique({
        where: { id },
        ...(include && { include }),
      });

      if (!item) {
        throw new NotFoundError(modelName.charAt(0).toUpperCase() + modelName.slice(1));
      }

      return item;
    },

    async create(data: TCreate) {
      const model = getModel();
      return model.create({ data });
    },

    async update(id: string, data: TUpdate) {
      const model = getModel();
      // Check existence first
      const existing = await model.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundError(modelName.charAt(0).toUpperCase() + modelName.slice(1));
      }

      return model.update({
        where: { id },
        data,
      });
    },

    async delete(id: string) {
      const model = getModel();
      const existing = await model.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundError(modelName.charAt(0).toUpperCase() + modelName.slice(1));
      }

      return model.delete({ where: { id } });
    },
  };
}
