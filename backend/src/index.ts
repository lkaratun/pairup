import "reflect-metadata";
// import { UserResolver } from "./resolvers/UserResolver";
// import { LocationResolver } from "./resolvers/LocationResolver";
// import { ActivityResolver } from "./resolvers/ActivityResolver";
// import { AdResolver } from "./resolvers/AdResolver";
import typeDefs from "./typeDefs";

import { PrismaClient } from "@prisma/client";

const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const prisma = new PrismaClient();

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
    users: async () => {
      const allUsers = await prisma.user.findMany();
      return allUsers;
    }
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
