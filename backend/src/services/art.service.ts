import prisma from '../config/db';
import { NotFoundError } from '../helpers/errors';
import { createCrudService } from './crud.factory';
import type { CreateArtInput, UpdateArtInput } from '../validators/art.validator';

const baseCrud = createCrudService<CreateArtInput, UpdateArtInput>('art');

export const artService = {
  ...baseCrud,

  async findByIdWithComments(id: string) {
    const item = await prisma.art.findUnique({
      where: { id },
      include: {
        comments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      throw new NotFoundError('Art');
    }

    return item;
  },
};

