import { createCrudController } from './crud.factory';
import { bookService } from '../services/book.service';

export const bookController = createCrudController(bookService, 'Book');
