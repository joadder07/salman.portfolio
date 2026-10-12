import { Router } from 'express';
import { educationController } from '../controllers/education.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createEducationSchema,
  updateEducationSchema,
} from '../validators/education.validator';

const router = Router();

router.get('/', educationController.getAll);
router.get('/:id', educationController.getById);
router.post('/', authMiddleware, validate(createEducationSchema), educationController.create);
router.put('/:id', authMiddleware, validate(updateEducationSchema), educationController.update);
router.delete('/:id', authMiddleware, educationController.remove);

export default router;
