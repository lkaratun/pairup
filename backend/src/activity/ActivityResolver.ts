export default {
  Query: {
    activity: (parent, args, context, info) =>
      context.prisma.activity.findOne({
        where: { id: args.id }
      }),
    activities: (parent, args, context) => context.prisma.activity.findMany()
  },
  Mutation: {
    activity: async (parent, args, context) => {
      return context.prisma.activity.update({
        where: { id: args.id },
        data: args.data
      });
    },
    createActivity: (parent, args, context, info) => {
      return context.prisma.activity.create({
        data: {
          name: args.data.name
        }
      });
    }
  }
};
