import { PubSub } from 'graphql-subscriptions';
import type { BookModel, BookShelfModel } from './models';
import type { Resolvers } from './types';

type PubSubPayload = {
  'book.add': { bookSub: BookModel };
  'book.update': { bookSub: BookModel };
};

const pubsub = new PubSub<PubSubPayload>();

const SUBSCRIPTION_EVENTS = {
  BOOK: ['book.add', 'book.update'],
};

export const resolvers: Resolvers = {
  Query: {
    // book.graphql
    books: (_, { title }, { dataSources }) => {
      return dataSources.bookApi.getBooks(title);
    },
    book: (_, { id }, { dataSources }) => {
      return dataSources.bookApi.getBook(id);
    },

    // book-shelf.gql
    bookShelves: (_, __, { dataSources }) => {
      return dataSources.bookShelfApi.get();
    },
    bookShelf: (_, { id }, { dataSources }) => {
      return dataSources.bookShelfApi.get(id);
    },
  },
  Mutation: {
    // book.graphql
    addBook: (_, { input }, { dataSources }) => {
      const newBook: BookModel = {
        id: Date.now().toString(),
        description: '',
        ...input,
      };

      dataSources.bookApi.addBook(newBook);

      // Emit events
      pubsub.publish('book.add', {
        bookSub: newBook,
      });

      return newBook;
    },
    deleteBook: (_, { id }, { dataSources }) => {
      dataSources.bookApi.deleteBook(id);
      return true;
    },
    updateBook: (_, { input }, { dataSources }) => {
      const result = dataSources.bookApi.updateBook(input);

      if (result) {
        pubsub.publish('book.update', {
          bookSub: result,
        });
      }

      return result;
    },

    // book-shelf.gql
    bookShelfImport: (_, { input }, { dataSources }) => {
      const bookShelf = dataSources.bookShelfApi.get(input.bookShelfId);
      const book = dataSources.bookApi.getBook(input.bookId);

      if (bookShelf && book) {
        bookShelf.books.push(book);
      }

      return bookShelf;
    },

    bookShelfAddLabel: (_, { input }, { dataSources }) => {
      const shelf = dataSources.bookShelfApi.addLabel(
        input.bookShelfId,
        input.label
      );

      if (shelf) {
        return shelf;
      }

      throw new Error('Failed to add label to the bookshelf');
    },
  },
  Subscription: {
    // defined in schema
    bookSub: {
      // Listen to events
      subscribe: () => {
        return pubsub.asyncIterableIterator(SUBSCRIPTION_EVENTS.BOOK);
      },
    },
  },
};
