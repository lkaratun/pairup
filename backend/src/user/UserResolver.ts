export default {
  Query: {
    user: (parent, args, context, info) =>
      context.prisma.user.findOne({
        where: { id: args.id }
      }),
    users: async (parent, args, context) => {
      console.log("In users resolver");
      const users = await context.prisma.user.findMany();
      console.log("🚀 ~ file: UserResolver.ts ~ line 10 ~ users", users);
      return users;
    }
  },
  Mutation: {
    user: async (parent, args, context) => {
    console.log("🚀 ~ file: UserResolver.ts ~ line 16 ~ user: ~ args", args);
      
      return context.prisma.user.update({
        where: { id: args.id },
        data: args.data
      });
    }
  },
  User: {
    ads: async (parent, args, context) => {
      return context.prisma.ad.findMany({
        where: { userId: parent.id }
      });
    },
    adResponses: async (parent, args, context) => {
      return context.prisma.adResponse.findMany({
        where: { userId: parent.id }
      });
    }
  }
};
