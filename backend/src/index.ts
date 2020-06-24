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
// import { AuthRequired } from "./directives/authRequired";
import { defaultFieldResolver } from "graphql";
// console.log("AuthRequired", AuthRequired);
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET env.var missing!");

import {
  ApolloServer,
  SchemaDirectiveVisitor,
  AuthenticationError
} from "apollo-server-express";
import express from "express";
const cookieParser = require("cookie-parser");

const prisma = new PrismaClient();

class AuthRequired extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(parent, args, context, info) {
      if (context.userId)
        return resolve.apply(this, parent, args, context, info);

      const { cookies } = context;
      const token = cookies?.token;
      if (!token) return new AuthenticationError("Auth token not found");
      const { userId } = jwt.verify(token, secret);
      if (!userId)
        return new AuthenticationError(
          `Can't resolve field "${info.fieldName}". Reason: userId is missing in token payload`
        );

      context.userId = userId;
      return resolve.apply(this, parent, args, context, info);
    };
  }
}

console.log("AuthRequired", AuthRequired);
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
  schemaDirectives: { authRequired: AuthRequired },
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
