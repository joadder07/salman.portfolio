import cloudinary from '../config/cloudinary';
import { AppError } from '../helpers/errors';
import { Readable } from 'stream';

interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
  resourceType: string;
  bytes: number;
}

export class UploadService {
  /** Upload a file buffer to Cloudinary */
  static async uploadFile(
    buffer: Buffer,
    options?: {
      folder?: string;
      resourceType?: 'image' | 'video' | 'raw' | 'auto';
      transformation?: Record<string, unknown>;
    }
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options?.folder || 'portfolio',
          resource_type: options?.resourceType || 'auto',
          ...(options?.transformation && { transformation: options.transformation }),
        },
        (error, result) => {
          if (error || !result) {
            reject(new AppError('Failed to upload file to Cloudinary', 500));
            return;
          }

          resolve({
            publicId: result.public_id,
            url: result.url,
            secureUrl: result.secure_url,
            format: result.format,
            width: result.width,
            height: result.height,
            resourceType: result.resource_type,
            bytes: result.bytes,
          });
        }
      );

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  /** Delete a file from Cloudinary by its public ID */
  static async deleteFile(publicId: string, resourceType: string = 'image') {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result !== 'ok') {
      throw new AppError('Failed to delete file from Cloudinary', 500);
    }

    return { success: true, publicId };
  }
}
