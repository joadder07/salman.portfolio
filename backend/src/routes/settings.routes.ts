import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateSettingsSchema } from '../validators/settings.validator';

const router = Router();

// Public: get site settings (theme, profile pic, site name, social links, playlist)
router.get('/', settingsController.get);

// Admin: update site settings
router.put('/', authMiddleware, validate(updateSettingsSchema), settingsController.update);

export default router;
