import { createCrudController } from './crud.factory';
import { artService } from '../services/art.service';

export const artController = createCrudController(artService, 'Art');
