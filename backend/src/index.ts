import "reflect-metadata";
import typeDefs from "./typeDefs";
import { PrismaClient } from "@prisma/client";
import { merge, keyBy, cloneDeepWith, cloneDeep, mapValues } from "lodash";
import ActivitySchema from "./activity/ActivitySchema";
import ActivityResolver from "./activity/ActivityResolver";
import ActivityResponseSchema from "./activityResponse/ActivityResponseSchema";
import ActivityResponseResolver from "./activityResponse/ActivityResponseResolver";
import UserSchema from "./user/UserSchema";
import UserResolver from "./user/UserResolver";
import ActivityTypeSchema from "./activityType/ActivityTypeSchema";
import ActivityTypeResolver from "./activityType/ActivityTypeResolver";
import LocationSchema from "./location/LocationSchema";
import LocationResolver from "./location/LocationResolver";
import AuthSchema from "./auth/AuthSchema";
import AuthResolver from "./auth/AuthResolver";
import AuthRequired from "./directives/AuthRequired";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cookieParser from "cookie-parser";

require("dotenv").config();

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET env.var missing!");

const prisma = new PrismaClient({
  log: ["query", "info", "warn"]
});

const server = new ApolloServer({
  typeDefs: [typeDefs, UserSchema, ActivityTypeSchema, LocationSchema, ActivitySchema, ActivityResponseSchema, AuthSchema],
  resolvers: merge(ActivityResolver, ActivityResponseResolver, UserResolver, ActivityTypeResolver, LocationResolver, AuthResolver),
  playground: {
    settings: {
      "request.credentials": "same-origin"
    }
  },
  schemaDirectives: { AuthRequired },
  context: async ctx => {
    return { ...ctx, prisma };
  },
  // formatResponse: (response, requestContext) => {
  //   const { data, errors } = response;
  //   if (errors) return response;
    
  //   function isPrimitive(val) {
  //     if (typeof val === 'object') {
  //       return val === null;
  //     }
  //     return typeof val !== 'function';
  //   }
    
  //   function  isObject(value) {
  //     return typeof value === 'object' && value !== null;
  //   }
    
  //   function myKeyBy(value) {
  //     if (isPrimitive(value)) return value;
  //     if (Array.isArray(value)) return myKeyBy(keyBy(value, 'id'));
  //     if (isObject(value)) {
  //       const result = mapValues(value, d => myKeyBy(d));
  //       // Object.setPrototypeOf(result, null);
  //       return result;
  //     }
  //     return value;
  //   }
    
  //   const newData = myKeyBy(cloneDeep(data));
    
  //   return {data: newData};
  // }
});

const app = express();
app.use(cookieParser());

server.applyMiddleware({
  app,
  cors: {
    origin: "http://local.pair-up.net",
    credentials: true
  }
});

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
