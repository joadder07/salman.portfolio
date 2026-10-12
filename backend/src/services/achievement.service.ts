import { createCrudService } from './crud.factory';
import type { CreateAchievementInput, UpdateAchievementInput } from '../validators/achievement.validator';

export const achievementService = createCrudService<CreateAchievementInput, UpdateAchievementInput>('achievement');
