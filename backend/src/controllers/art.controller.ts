import { Request, Response } from 'express';
import { createCrudController } from './crud.factory';
import { artService } from '../services/art.service';
import { asyncHandler } from '../helpers/asyncHandler';
import { apiResponse } from '../helpers/apiResponse';

const baseCrud = createCrudController(artService, 'Art');

export const artController = {
  ...baseCrud,

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await artService.findByIdWithComments(id);

    apiResponse({
      res,
      message: 'Art piece fetched',
      data: item,
    });
  }),
};

