import prisma from '../config/db';
import { NotFoundError } from '../helpers/errors';
import { createCrudService } from './crud.factory';
import type { CreatePetInput, UpdatePetInput } from '../validators/pet.validator';

const baseCrud = createCrudService<CreatePetInput, UpdatePetInput>('pet');

export const petService = {
  ...baseCrud,

  async findByIdWithComments(id: string) {
    const item = await prisma.pet.findUnique({
      where: { id },
      include: {
        comments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      throw new NotFoundError('Pet');
    }

    return item;
  },
};

