import { createCrudController } from './crud.factory';
import { hobbyService } from '../services/hobby.service';

export const hobbyController = createCrudController(hobbyService, 'Hobby');
