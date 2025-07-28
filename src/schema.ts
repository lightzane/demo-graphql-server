import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';

export const schema = loadSchemaSync(['src/**/*.graphql', 'src/**/*.gql'], {
  loaders: [new GraphQLFileLoader()], // https://the-guild.dev/graphql/tools/docs/schema-loading#graphqlfileloader
});
