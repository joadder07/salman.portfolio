import { createCrudService } from './crud.factory';
import type { CreateEducationInput, UpdateEducationInput } from '../validators/education.validator';

export const educationService = createCrudService<CreateEducationInput, UpdateEducationInput>('education');
