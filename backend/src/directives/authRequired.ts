const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET env.var missing!");

class UpperCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(parent, args, context, info) {
      const { req, prisma } = context;
      const token = req?.cookies?.token;
      if (!token)
        prisma.user.findOne({
          where: { id: args.id }
        });

      return resolve.apply(this, parent, args, context, info);
    };
  }
}
