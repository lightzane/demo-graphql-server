import { PubSub } from 'graphql-subscriptions';
import { BookModel } from './models';
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
