export default {
  Query: {
    activitytype: (parent, args, context, info) =>
      context.prisma.activitytype.findUnique({
        where: { id: args.id }
      }),
    activityTypes: (parent, args, context) => context.prisma.activitytype.findMany({include: {ads: true}})
  },
  Mutation: {
    activitytype: async (parent, args, context) => {
      return context.prisma.activitytype.update({
        where: { id: args.id },
        data: args.data
      });
    },
    createActivityType: (parent, args, context, info) => {
      return context.prisma.activitytype.create({
        data: {
          name: args.data.name
        }
      });
    }
  }
};
