export default {
  Query: {
    activity: (parent, args, context, info) =>
      context.prisma.activity.findOne({
        where: {
          id: args.id
        }
      }),
    activities: (parent, args, context) => context.prisma.activity.findMany()
  }
};
