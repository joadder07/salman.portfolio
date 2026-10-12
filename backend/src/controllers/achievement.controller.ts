import { createCrudController } from './crud.factory';
import { achievementService } from '../services/achievement.service';

export const achievementController = createCrudController(achievementService, 'Achievement');
