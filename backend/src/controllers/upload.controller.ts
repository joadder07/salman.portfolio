import { Request, Response } from 'express';
import { UploadService } from '../services/upload.service';
import { asyncHandler } from '../helpers/asyncHandler';
import { apiResponse } from '../helpers/apiResponse';
import { ValidationError } from '../helpers/errors';

export const uploadController = {
  uploadFile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ValidationError('No file provided');
    }

    const folder = (req.body.folder as string) || 'portfolio';
    const resourceType = req.file.mimetype.startsWith('video/')
      ? 'video'
      : req.file.mimetype.startsWith('audio/')
      ? 'video' // Cloudinary stores audio under video resource type
      : 'image';

    const result = await UploadService.uploadFile(req.file.buffer, {
      folder,
      resourceType: resourceType as 'image' | 'video',
    });

    apiResponse({
      res,
      statusCode: 201,
      message: 'File uploaded successfully',
      data: result,
    });
  }),

  deleteFile: asyncHandler(async (req: Request, res: Response) => {
    const publicId = Array.isArray(req.params.publicId) ? req.params.publicId[0] : req.params.publicId;
    const resourceType = (req.query.resourceType as string) || 'image';

    const result = await UploadService.deleteFile(publicId, resourceType);

    apiResponse({
      res,
      message: 'File deleted from Cloudinary successfully',
      data: result,
    });
  }),
};
