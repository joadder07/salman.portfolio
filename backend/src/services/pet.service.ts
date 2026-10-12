import { createCrudService } from './crud.factory';
import type { CreatePetInput, UpdatePetInput } from '../validators/pet.validator';

export const petService = createCrudService<CreatePetInput, UpdatePetInput>('pet');
