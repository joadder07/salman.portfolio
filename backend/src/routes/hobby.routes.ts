import { Router } from 'express';
import { hobbyController } from '../controllers/hobby.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createHobbySchema, updateHobbySchema } from '../validators/hobby.validator';

const router = Router();

router.get('/', hobbyController.getAll);
router.get('/:id', hobbyController.getById);
router.post('/', authMiddleware, validate(createHobbySchema), hobbyController.create);
router.put('/:id', authMiddleware, validate(updateHobbySchema), hobbyController.update);
router.delete('/:id', authMiddleware, hobbyController.remove);

export default router;
