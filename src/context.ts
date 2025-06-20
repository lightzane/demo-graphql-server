import type { BookAPI } from './datasources/book-api';

export type DataSourceContext = {
  dataSources: {
    bookApi: BookAPI;
  };
};
