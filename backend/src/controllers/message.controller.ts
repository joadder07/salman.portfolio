import { Request, Response } from 'express';
import { MessageService } from '../services/message.service';
import { asyncHandler } from '../helpers/asyncHandler';
import { apiResponse } from '../helpers/apiResponse';
import { getPagination, getPaginationMeta } from '../helpers/pagination';

export const messageController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const pagination = getPagination(req);
    const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;

    const { items, total } = await MessageService.findAll(pagination, { isRead });

    apiResponse({
      res,
      message: 'Messages fetched successfully',
      data: items,
      meta: getPaginationMeta(total, pagination),
    });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const message = await MessageService.create(req.body);

    apiResponse({
      res,
      statusCode: 201,
      message: 'Message sent successfully',
      data: message,
    });
  }),

  markAsRead: asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const message = await MessageService.markAsRead(id);

    apiResponse({
      res,
      message: 'Message marked as read',
      data: message,
    });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await MessageService.delete(id);

    apiResponse({
      res,
      message: 'Message deleted successfully',
    });
  }),

  getUnreadCount: asyncHandler(async (_req: Request, res: Response) => {
    const count = await MessageService.getUnreadCount();

    apiResponse({
      res,
      message: 'Unread message count fetched',
      data: { count },
    });
  }),
};
