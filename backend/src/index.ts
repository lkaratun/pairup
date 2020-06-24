require("dotenv").config();
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
import AuthType from "./auth/AuthType";
import AuthResolver from "./auth/AuthResolver";
import AuthRequired from "./directives/AuthRequired";
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET env.var missing!");

import { ApolloServer } from "apollo-server-express";
import express from "express";
const cookieParser = require("cookie-parser");

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs: [
    typeDefs,
    UserType,
    ActivityType,
    LocationType,
    AdType,
    AdResponseType,
    AuthType
  ],
  resolvers: merge(
    AdResolver,
    AdResponseResolver,
    UserResolver,
    ActivityResolver,
    LocationResolver,
    AuthResolver
  ),
  playground: {
    settings: {
      "request.credentials": "same-origin"
    }
  },
  schemaDirectives: { AuthRequired },
  // schemaDirectives: { upper: UpperCaseDirective },
  context: async ctx => {
    console.log("ctx.req.cookies", ctx.req.cookies);
    return { ...ctx, prisma, cookies: ctx.req.cookies };
  }
});

const app = express();
app.use(cookieParser());
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
