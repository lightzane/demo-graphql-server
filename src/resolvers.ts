import { BookModel } from './models';
import type { Resolvers } from './types';

export const resolvers: Resolvers = {
  Query: {
    books: (_, { title }, { dataSources }) => {
      return dataSources.bookApi.getBooks(title);
    },
    book: (_, { id }, { dataSources }) => {
      return dataSources.bookApi.getBook(id);
    },
  },
  Mutation: {
    addBook: (_, { input }, { dataSources }) => {
      const newBook: BookModel = {
        id: Date.now().toString(),
        description: '',
        ...input,
      };

      dataSources.bookApi.addBook(newBook);

      return newBook;
    },
    deleteBook: (_, { id }, { dataSources }) => {
      dataSources.bookApi.deleteBook(id);
      return true;
    },
    updateBook: (_, { input }, { dataSources }) => {
      return dataSources.bookApi.updateBook(input);
    },
  },
};
