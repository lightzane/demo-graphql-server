import { ApolloServer, type BaseContext } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { BookAPI } from './datasources/book-api';

async function startApolloServer() {
  const port = +(process.env.PORT ?? 4000);
  const server = new ApolloServer<BaseContext>({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async () => {
      return {
        dataSources: {
          bookApi: new BookAPI(),
        },
      };
    },
  });

  console.log(`🚀 GraphQL Server running at ${url}`);
}

startApolloServer();
