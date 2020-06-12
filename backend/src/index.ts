import "reflect-metadata";
import typeDefs from "./typeDefs";

import { PrismaClient } from "@prisma/client";

const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    hello: () => "Hello world!",
    user: (parent, args, context, info) =>
      prisma.user.findOne({
        where: {
          id: args.id
        }
      }),
    users: () => prisma.user.findMany(),
    activity: (parent, args, context, info) =>
      prisma.activity.findOne({
        where: {
          id: args.id
        }
      }),
    activities: () => prisma.activity.findMany(),
    location: (parent, args, context, info) =>
      prisma.location.findOne({
        where: {
          id: args.id
        }
      }),
    locations: () => prisma.location.findMany(),
    ad: (parent, args, context, info) =>
      prisma.ad.findOne({
        where: {
          id: args.id
        }
      }),
    ads: () => prisma.ad.findMany()
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

// main()
//   .catch(e => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.disconnect();
//   });
