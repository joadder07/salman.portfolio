import { Router } from 'express';
import { bookController } from '../controllers/book.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createBookSchema, updateBookSchema } from '../validators/book.validator';

const router = Router();

router.get('/', bookController.getAll);
router.get('/:id', bookController.getById);
router.post('/', authMiddleware, validate(createBookSchema), bookController.create);
router.put('/:id', authMiddleware, validate(updateBookSchema), bookController.update);
router.delete('/:id', authMiddleware, bookController.remove);

export default router;
