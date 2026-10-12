import { Request, Response } from 'express';
import { createCrudController } from './crud.factory';
import { photographyService } from '../services/photography.service';
import { asyncHandler } from '../helpers/asyncHandler';
import { apiResponse } from '../helpers/apiResponse';
import { getPagination, getPaginationMeta } from '../helpers/pagination';

const baseCrud = createCrudController(photographyService, 'Photography');

export const photographyController = {
  ...baseCrud,

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const filters: { category?: string; featured?: boolean } = {};

    if (req.query.category) filters.category = req.query.category as string;
    if (req.query.featured) filters.featured = req.query.featured === 'true';

    const { items, total } = await photographyService.findAll(pagination, filters);

    apiResponse({
      res,
      message: 'Photography list fetched',
      data: items,
      meta: getPaginationMeta(total, pagination),
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await photographyService.findByIdWithComments(id);

    apiResponse({
      res,
      message: 'Photography fetched',
      data: item,
    });
  }),
};
