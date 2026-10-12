import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';

const router = Router();

// Admin: upload file to Cloudinary
router.post('/', authMiddleware, uploadSingle, uploadController.uploadFile);

// Admin: delete file from Cloudinary by publicId
router.delete('/:publicId', authMiddleware, uploadController.deleteFile);

export default router;
