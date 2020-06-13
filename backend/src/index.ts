import "reflect-metadata";
import typeDefs from "./typeDefs";

import { PrismaClient } from "@prisma/client";
import { merge } from "lodash";
import AdResolver from "./ad/AdResolver";
import AdResponseResolver from "./adResponse/AdResponseResolver";
import UserResolver from "./user/UserResolver";
import ActivityResolver from "./activity/ActivityResolver";
import LocationResolver from "./location/LocationResolver";

const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers: merge(
    AdResolver,
    AdResponseResolver,
    UserResolver,
    ActivityResolver,
    LocationResolver
  ),
  context: { prisma }
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
