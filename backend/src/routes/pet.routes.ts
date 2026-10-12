import { Router } from 'express';
import { petController } from '../controllers/pet.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPetSchema, updatePetSchema } from '../validators/pet.validator';

const router = Router();

router.get('/', petController.getAll);
router.get('/:id', petController.getById);
router.post('/', authMiddleware, validate(createPetSchema), petController.create);
router.put('/:id', authMiddleware, validate(updatePetSchema), petController.update);
router.delete('/:id', authMiddleware, petController.remove);

export default router;
