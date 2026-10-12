import { createCrudService } from './crud.factory';
import type { CreateHobbyInput, UpdateHobbyInput } from '../validators/hobby.validator';

export const hobbyService = createCrudService<CreateHobbyInput, UpdateHobbyInput>('hobby');
