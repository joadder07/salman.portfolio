import { Request, Response } from 'express';
import { SettingsService } from '../services/settings.service';
import { asyncHandler } from '../helpers/asyncHandler';
import { apiResponse } from '../helpers/apiResponse';

export const settingsController = {
  get: asyncHandler(async (_req: Request, res: Response) => {
    const settings = await SettingsService.get();

    apiResponse({
      res,
      message: 'Site settings fetched successfully',
      data: settings,
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const settings = await SettingsService.update(req.body);

    apiResponse({
      res,
      message: 'Site settings updated successfully',
      data: settings,
    });
  }),
};
