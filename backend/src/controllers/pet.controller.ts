import { createCrudController } from './crud.factory';
import { petService } from '../services/pet.service';

export const petController = createCrudController(petService, 'Pet');
