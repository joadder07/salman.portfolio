import prisma from '../config/db';
import { NotFoundError } from '../helpers/errors';
import { createCrudService } from './crud.factory';
import type { CreateHobbyInput, UpdateHobbyInput } from '../validators/hobby.validator';

const baseCrud = createCrudService<CreateHobbyInput, UpdateHobbyInput>('hobby');

export const hobbyService = {
  ...baseCrud,

  async findByIdWithComments(id: string) {
    const item = await prisma.hobby.findUnique({
      where: { id },
      include: {
        comments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      throw new NotFoundError('Hobby');
    }

    return item;
  },
};

