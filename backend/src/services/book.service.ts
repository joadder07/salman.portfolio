import { createCrudService } from './crud.factory';
import type { CreateBookInput, UpdateBookInput } from '../validators/book.validator';

export const bookService = createCrudService<CreateBookInput, UpdateBookInput>('book');
