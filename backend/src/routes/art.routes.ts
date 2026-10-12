import { Router } from 'express';
import { artController } from '../controllers/art.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createArtSchema, updateArtSchema } from '../validators/art.validator';

const router = Router();

router.get('/', artController.getAll);
router.get('/:id', artController.getById);
router.post('/', authMiddleware, validate(createArtSchema), artController.create);
router.put('/:id', authMiddleware, validate(updateArtSchema), artController.update);
router.delete('/:id', authMiddleware, artController.remove);

export default router;
