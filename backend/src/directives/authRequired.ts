import {
  SchemaDirectiveVisitor,
  AuthenticationError
} from "apollo-server-express";
import { defaultFieldResolver } from "graphql";
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET env.var missing!");

export default class AuthRequired extends SchemaDirectiveVisitor {
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
