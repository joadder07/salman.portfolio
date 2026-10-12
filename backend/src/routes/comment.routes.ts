import { Router } from 'express';
import { commentController } from '../controllers/comment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createCommentSchema,
  updateCommentStatusSchema,
} from '../validators/comment.validator';

const router = Router();

// Public: submit comment
router.post('/', validate(createCommentSchema), commentController.create);

// Admin routes
router.get('/', authMiddleware, commentController.getAll);
router.get('/pending-count', authMiddleware, commentController.getPendingCount);
router.patch('/:id/status', authMiddleware, validate(updateCommentStatusSchema), commentController.updateStatus);
router.delete('/:id', authMiddleware, commentController.remove);

export default router;
