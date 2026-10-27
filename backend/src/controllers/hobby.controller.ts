import { Request, Response } from 'express';
import { createCrudController } from './crud.factory';
import { hobbyService } from '../services/hobby.service';
import { asyncHandler } from '../helpers/asyncHandler';
import { apiResponse } from '../helpers/apiResponse';

const baseCrud = createCrudController(hobbyService, 'Hobby');

export const hobbyController = {
  ...baseCrud,

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await hobbyService.findByIdWithComments(id);

    apiResponse({
      res,
      message: 'Hobby fetched',
      data: item,
    });
  }),
};

