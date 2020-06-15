export default {
  Query: {
    user: (parent, args, context, info) =>
      context.prisma.user.findOne({
        where: { id: args.id }
      }),
    users: (parent, args, context) => context.prisma.user.findMany()
  },
  Mutation: {
    user: async (parent, args, context) => {
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
