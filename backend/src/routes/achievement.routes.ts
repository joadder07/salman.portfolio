import { Router } from 'express';
import { achievementController } from '../controllers/achievement.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createAchievementSchema,
  updateAchievementSchema,
} from '../validators/achievement.validator';

const router = Router();

router.get('/', achievementController.getAll);
router.get('/:id', achievementController.getById);
router.post('/', authMiddleware, validate(createAchievementSchema), achievementController.create);
router.put('/:id', authMiddleware, validate(updateAchievementSchema), achievementController.update);
router.delete('/:id', authMiddleware, achievementController.remove);

export default router;
