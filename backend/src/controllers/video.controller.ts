import { Request, Response } from 'express';
import { createCrudController } from './crud.factory';
import { videoService } from '../services/video.service';
import { asyncHandler } from '../helpers/asyncHandler';
import { apiResponse } from '../helpers/apiResponse';
import { getPagination, getPaginationMeta } from '../helpers/pagination';

const baseCrud = createCrudController(videoService, 'Video');

export const videoController = {
  ...baseCrud,

  getAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const filters: { category?: string; featured?: boolean } = {};

    if (req.query.category) filters.category = req.query.category as string;
    if (req.query.featured) filters.featured = req.query.featured === 'true';

    const { items, total } = await videoService.findAll(pagination, filters);

    apiResponse({
      res,
      message: 'Video list fetched',
      data: items,
      meta: getPaginationMeta(total, pagination),
    });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await videoService.findByIdWithComments(id);

    apiResponse({
      res,
      message: 'Video fetched',
      data: item,
    });
  }),
};
