import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { asyncHandler } from '../helpers/asyncHandler';
import { apiResponse } from '../helpers/apiResponse';
import { getPagination, getPaginationMeta } from '../helpers/pagination';
import { CommentStatus } from '@prisma/client';

export const commentController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const status = req.query.status as CommentStatus | undefined;

    const { items, total } = await CommentService.findAll(pagination, { status });

    apiResponse({
      res,
      message: 'Comments fetched successfully',
      data: items,
      meta: getPaginationMeta(total, pagination),
    });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const comment = await CommentService.create(req.body);

    apiResponse({
      res,
      statusCode: 201,
      message: 'Comment submitted successfully and pending moderation',
      data: comment,
    });
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;
    const comment = await CommentService.updateStatus(id, status);

    apiResponse({
      res,
      message: `Comment status updated to ${status}`,
      data: comment,
    });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await CommentService.delete(id);

    apiResponse({
      res,
      message: 'Comment deleted successfully',
    });
  }),

  getPendingCount: asyncHandler(async (_req: Request, res: Response) => {
    const count = await CommentService.getPendingCount();

    apiResponse({
      res,
      message: 'Pending comments count fetched',
      data: { count },
    });
  }),
};
