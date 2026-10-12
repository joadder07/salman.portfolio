import { createCrudService } from './crud.factory';
import type { CreateArtInput, UpdateArtInput } from '../validators/art.validator';

export const artService = createCrudService<CreateArtInput, UpdateArtInput>('art');
