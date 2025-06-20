import { readFileSync } from 'fs';
import gql from 'graphql-tag';

export const typeDefs = gql(
  readFileSync('./src/schema.graphql', { encoding: 'utf8' })
);
