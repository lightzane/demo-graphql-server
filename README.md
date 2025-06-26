# Demo GraphQL Server ![](https://img.shields.io/badge/node-22.16.0-green?style=flat)![](https://img.shields.io/badge/npm-10.9.2-2ecc71?style=flat)

Quickly run a GraphQL `expressMiddleware` Apollo server in your local with **Express 5**

## Install dependencies

```bash
npm ci # or `npm install`
```

## Run Server

```bash
npm run dev
```

## Access server

```
http://localhost:4000/graphql
```

Or try it with a front-end UI: https://github.com/lightzane/try-vue-graphql

## Build server

```bash
npm run build
```

```bash
npm start
```

## How this project was created

References:

- https://github.com/lightzane/learn-graphql-apolloserver4/tree/final?tab=readme-ov-file#episodes
- https://github.com/lightzane/learn-graphql-apolloserver4/tree/i-express?tab=readme-ov-file

## Express v5 and Apollo Server

Reference: https://www.apollographql.com/docs/apollo-server/v4/api/express-middleware

```bash
npm i @as-integrations/express5
```

```diff
-import { expressMiddleware } from '@apollo/server/express4';
+import { expressMiddleware } from '@as-integrations/express5';
```

## Enabling Subscription (Server)

Reference: https://www.apollographql.com/docs/apollo-server/data/subscriptions#enabling-subscriptions ([Apollo Server v4](https://www.apollographql.com/docs/apollo-server/v4/data/subscriptions))

> Subscriptions are **not** supported by Apollo Server 4's `startStandaloneServer` function. To enable subscriptions, you must first swap to using the `expressMiddleware` function (or any other Apollo Server integration package that supports subscriptions).

### Install dependencies

```bash
npm install graphql-ws ws @graphql-tools/schema
```

The **subscription** server (which we'll instantiate next) doesn't take `typeDefs` and `resolvers` options. Instead, it takes an executable `GraphQLSchema`. We can pass this schema object to both the subscription server and `ApolloServer`. This way, we make sure that the same schema is being used in both places.

#### Setup Servers

1. Express
2. HTTP Server (node)
3. WebsocketServer (ws)
4. Apollo Server

See: [**main.ts**](./src/main.ts#L15)

```ts
const schema = makeExecutableSchema({ typeDefs, resolvers });
// ...
const server = new ApolloServer({
  schema,
});
```

#### Some Errors on the `graphql-ws` package

Reference: https://the-guild.dev/graphql/ws/get-started#with-ws

Seems like when using the _following import_, the typescript is throwing an error that it _cannot find module_:

```ts
// main.ts
import { useServer } from 'graphql-ws/use/ws';
```

But the documentation says should be at the import path. So try to update the `tsconfig.json` like so:

```json
{
  "module": "nodenext",
  "moduleResolution": "nodenext"
}
```

### Schema

```gql
type Subscription {
  bookSub: Book!
}
```

### Subscription Query

When this query is sent, the server should now indicate "loading" that it is listening

```gql
subscription Subscription {
  bookSub {
    id
    title
  }
}
```

### Resolving a Subscription

Reference: https://www.apollographql.com/docs/apollo-server/data/subscriptions#resolving-a-subscription

```bash
npm install graphql-subscriptions
```

See [`resolvers.ts`](./src/resolvers.ts#L63)

#### Declaration

```ts
import { PubSub } from 'graphql-subscriptions';

type PubSubPayload = {
  'book.add': { bookSub: BookModel };
  'book.update': { bookSub: BookModel };
};

const pubsub = new PubSub<PubSubPayload>();
```

#### Listening to events

```ts
Subscription: {
    // defined in schema
    bookSub: {
      // Listen to events
      subscribe: () => {
        return pubsub.asyncIterableIterator(SUBSCRIPTION_EVENTS.BOOK);
      },
    },
  },
```

#### Emitting or publishing events

```ts
Mutation: {
  addBook: (_, { input }, { dataSources }) => {
      const newBook: BookModel = {
        ...
      };

      dataSources.bookApi.addBook(newBook);

      // Emit events
      pubsub.publish('book.add', {
        bookSub: newBook,
      });

      return newBook;
    },
}
```

## Enabling Subscription (Web Client)

See docs: https://www.apollographql.com/docs/react/data/subscriptions#websocket-setup
