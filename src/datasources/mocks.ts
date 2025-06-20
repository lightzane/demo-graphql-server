import type { BookModel } from '../models';
import * as db from './db.json';

const books = [...db.books] as BookModel[];

export default { books };
