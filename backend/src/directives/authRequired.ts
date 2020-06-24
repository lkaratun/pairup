const {
  SchemaDirectiveVisitor,
  AuthenticationError
} = require("apollo-server-express");
const { defaultFieldResolver } = require("graphql");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET env.var missing!");

export class AuthRequired extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field) {
    const { resolve } = field;
    field.resolve = async function(parent, args, context, info) {
      if (context.userId)
        return resolve.apply(this, parent, args, context, info);

      const { req, prisma } = context;
      const token = req?.cookies?.token;
      // if (!token) return new AuthenticationError("Auth token not found");
      // const { userId } = jwt.verify(token, secret);
      // if (!userId)
      //   return new AuthenticationError("userId is missing in token payload");

      // context.userId = userId;
      return resolve.apply(this, parent, args, context, info);
    };
  }
}
