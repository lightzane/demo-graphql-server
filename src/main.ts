import { ApolloServer, type BaseContext } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import express from 'express';
import { useServer } from 'graphql-ws/use/ws'; // https://the-guild.dev/graphql/ws/get-started#with-ws
import http from 'http';
import { WebSocketServer } from 'ws';

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

  // Create instance of GraphQL Schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const GRAPHQL_ENDPOINT_URL = '/graphql';

  // Create WebSocket server for Subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: GRAPHQL_ENDPOINT_URL,
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  // Create instance of Apollo Server
  const server = new ApolloServer<BaseContext>({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    GRAPHQL_ENDPOINT_URL,
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
