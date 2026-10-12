import { Router } from 'express';
import { photographyController } from '../controllers/photography.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createPhotographySchema,
  updatePhotographySchema,
} from '../validators/photography.validator';

const router = Router();

router.get('/', photographyController.getAll);
router.get('/:id', photographyController.getById);
router.post('/', authMiddleware, validate(createPhotographySchema), photographyController.create);
router.put('/:id', authMiddleware, validate(updatePhotographySchema), photographyController.update);
router.delete('/:id', authMiddleware, photographyController.remove);

export default router;
