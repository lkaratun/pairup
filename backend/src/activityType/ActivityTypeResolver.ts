export default {
  Query: {
    activityType: (parent, args, context, info) =>
      context.prisma.activityType.findUnique({
        where: { id: args.id }
      }),
    activityTypes: (parent, args, context) => context.prisma.activityType.findMany({include: {activities: true}})
  },
  Mutation: {
    activityType: async (parent, args, context) => {
      return context.prisma.activityType.update({
        where: { id: args.id },
        data: args.data
      });
    },
    createActivityType: (parent, args, context, info) => {
      return context.prisma.activityType.create({
        data: {
          name: args.data.name
        }
      });
    }
  }
};
