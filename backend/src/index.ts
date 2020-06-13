import "reflect-metadata";
import typeDefs from "./typeDefs";

import { PrismaClient } from "@prisma/client";
import { merge } from "lodash";
import AdType from "./ad/AdType";
import AdResolver from "./ad/AdResolver";
import AdResponseType from "./adResponse/AdResponseType";
import AdResponseResolver from "./adResponse/AdResponseResolver";
import UserType from "./user/UserType";
import UserResolver from "./user/UserResolver";
import ActivityType from "./activity/ActivityType";
import ActivityResolver from "./activity/ActivityResolver";
import LocationType from "./location/LocationType";
import LocationResolver from "./location/LocationResolver";

const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: [
    typeDefs,
    UserType,
    ActivityType,
    LocationType,
    AdType,
    AdResponseType
  ],
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
