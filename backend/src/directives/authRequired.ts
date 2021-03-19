import { SchemaDirectiveVisitor, AuthenticationError } from "apollo-server-express";
import { defaultFieldResolver } from "graphql";
import jwt from "jsonwebtoken";

interface TokenType {
  userId: string
}

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET env.var missing!");

export default class AuthRequired extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(parent, args, context, info) {
      if (context.userId) return resolve.call(this, parent, args, context, info);

      const { token } = context.req.cookies;
      if (!token) throw new AuthenticationError("Auth token not found");
      const {userId} = jwt.verify(token, secret) as TokenType;
      console.log("🚀 ~ file: authRequired.ts ~ line 21 ~ AuthRequired ~ visitFieldDefinition ~ userId", userId);

      if (!userId)
        throw new AuthenticationError(
          `Can't resolve field "${info.fieldName}". Reason: userId is missing in token payload`
        );

      context.userId = userId;
      return resolve.call(this, parent, args, context, info);
    };
  }

  visitObject(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(parent, args, context, info) {
      if (context.userId) return resolve.call(this, parent, args, context, info);

      const { token } = context.req.cookies;
      if (!token) throw new AuthenticationError("Auth token not found");
      const {userId} = jwt.verify(token, secret) as TokenType;
      console.log("🚀 ~ file: authRequired.ts ~ line 21 ~ AuthRequired ~ visitObject ~ userId", userId);

      if (!userId)
        throw new AuthenticationError(
          `Can't resolve field "${info.fieldName}". Reason: userId is missing in token payload`
        );

      context.userId = userId;
      return resolve.call(this, parent, args, context, info);
    };
  }
}
