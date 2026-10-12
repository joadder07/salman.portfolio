import { Request, Response } from 'express';
import { asyncHandler } from '../helpers/asyncHandler';
import { apiResponse } from '../helpers/apiResponse';
import { getPagination, getPaginationMeta } from '../helpers/pagination';

/**
 * Creates standard CRUD controller handlers for a given service.
 * Each entity controller can override or extend these as needed.
 */
export function createCrudController(service: {
  findAll: (...args: any[]) => Promise<{ items: any[]; total: number }>;
  findById: (id: string, include?: Record<string, unknown>) => Promise<any>;
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
}, entityName: string) {
  return {
    getAll: asyncHandler(async (req: Request, res: Response) => {
      const pagination = getPagination(req);
      const { items, total } = await service.findAll(pagination);

      apiResponse({
        res,
        message: `${entityName} list fetched`,
        data: items,
        meta: getPaginationMeta(total, pagination),
      });
    }),

    getById: asyncHandler(async (req: Request, res: Response) => {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const item = await service.findById(id);

      apiResponse({
        res,
        message: `${entityName} fetched`,
        data: item,
      });
    }),

    create: asyncHandler(async (req: Request, res: Response) => {
      const item = await service.create(req.body);

      apiResponse({
        res,
        statusCode: 201,
        message: `${entityName} created`,
        data: item,
      });
    }),

    update: asyncHandler(async (req: Request, res: Response) => {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const item = await service.update(id, req.body);

      apiResponse({
        res,
        message: `${entityName} updated`,
        data: item,
      });
    }),

    remove: asyncHandler(async (req: Request, res: Response) => {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await service.delete(id);

      apiResponse({
        res,
        message: `${entityName} deleted`,
      });
    }),
  };
}
