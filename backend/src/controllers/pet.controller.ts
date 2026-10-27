import { Request, Response } from 'express';
import { createCrudController } from './crud.factory';
import { petService } from '../services/pet.service';
import { asyncHandler } from '../helpers/asyncHandler';
import { apiResponse } from '../helpers/apiResponse';

const baseCrud = createCrudController(petService, 'Pet');

export const petController = {
  ...baseCrud,

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await petService.findByIdWithComments(id);

    apiResponse({
      res,
      message: 'Pet fetched',
      data: item,
    });
  }),
};

