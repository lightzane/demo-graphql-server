import type { BookAPI, BookShelfAPI } from './datasources';

export type DataSourceContext = {
  dataSources: {
    bookApi: BookAPI;
    bookShelfApi: BookShelfAPI;
  };
};
