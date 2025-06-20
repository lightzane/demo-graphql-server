import { ApolloServer, type BaseContext } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import express from 'express';
import http from 'http';

import { BookAPI } from './datasources/book-api';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors());
  app.use(express.json()); // To parse and read input data/body from the request

  const port = +(process.env.PORT ?? 4000);

  httpServer.listen(port, () => {
    console.log(
      `🚀 GraphQL Server running at http://localhost:${port}/graphql`
    );
  });

  app.get('/', (_, res) => {
    res.json({
      goto: '/graphql',
    });
  });

  const server = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async () => {
        return {
          dataSources: {
            bookApi: new BookAPI(),
          },
        };
      },
    })
  );
}

startServer();
