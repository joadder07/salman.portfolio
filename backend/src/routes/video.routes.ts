import { Router } from 'express';
import { videoController } from '../controllers/video.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createVideoSchema, updateVideoSchema } from '../validators/video.validator';

const router = Router();

router.get('/', videoController.getAll);
router.get('/:id', videoController.getById);
router.post('/', authMiddleware, validate(createVideoSchema), videoController.create);
router.put('/:id', authMiddleware, validate(updateVideoSchema), videoController.update);
router.delete('/:id', authMiddleware, videoController.remove);

export default router;
