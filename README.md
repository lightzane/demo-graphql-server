# Demo GraphQL Server ![](https://img.shields.io/badge/node-22.16.0-green?style=flat)![](https://img.shields.io/badge/npm-10.9.2-2ecc71?style=flat)

Quickly run a GraphQL `expressMiddleware` Apollo server in your local with **Express 5**

## Install dependencies

```bash
npm install
```

## Run Server

```bash
npm run dev
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

## Enabling Subscription

Reference: https://www.apollographql.com/docs/apollo-server/data/subscriptions#enabling-subscriptions

> Subscriptions are **not** supported by Apollo Server 4's `startStandaloneServer` function. To enable subscriptions, you must first swap to using the `expressMiddleware` function (or any other Apollo Server integration package that supports subscriptions).
