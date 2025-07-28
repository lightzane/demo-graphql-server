import type { BookModel, BookShelfModel } from '../models';
import * as db from './db.json';

const books = structuredClone(db.books) as BookModel[];
const bookShelves = structuredClone(db.bookShelves) as BookShelfModel[];

export default { books, bookShelves };
