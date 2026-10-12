import { createCrudController } from './crud.factory';
import { educationService } from '../services/education.service';

export const educationController = createCrudController(educationService, 'Education');
