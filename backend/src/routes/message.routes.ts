import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createMessageSchema } from '../validators/message.validator';

const router = Router();

// Public: send message (direct or anonymous)
router.post('/', validate(createMessageSchema), messageController.create);

// Admin routes
router.get('/', authMiddleware, messageController.getAll);
router.get('/unread-count', authMiddleware, messageController.getUnreadCount);
router.patch('/:id/read', authMiddleware, messageController.markAsRead);
router.delete('/:id', authMiddleware, messageController.remove);

export default router;
