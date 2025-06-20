import { BookModel } from '../models';
import type { InputMaybe, UpdateBookInput } from '../types';
import mocks from './mocks';

export class BookAPI {
  getBooks(title?: InputMaybe<string>) {
    if (!title) {
      return mocks.books;
    }

    return mocks.books.filter((b) =>
      b.title.toLowerCase().includes(title.trim().toLowerCase())
    );
  }

  getBook(id: string) {
    return mocks.books.find((b) => b.id === id) as BookModel | null;
  }

  addBook(book: BookModel) {
    mocks.books.push(book);
  }

  deleteBook(id: string) {
    return (mocks.books = mocks.books.filter((b) => b.id !== id));
  }

  updateBook(bookInput: UpdateBookInput) {
    const existingIdx = mocks.books.findIndex((b) => b.id === bookInput.id);

    if (existingIdx < 0) {
      return null;
    }

    const existingBook = mocks.books[existingIdx];

    const updated = {
      ...existingBook,
      ...bookInput,
    };

    return (mocks.books[existingIdx] = updated as BookModel);
  }
}
