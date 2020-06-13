export default {
  Query: {
    user: (parent, args, context, info) =>
      context.prisma.user.findOne({
        where: {
          id: args.id
        }
      }),
    users: (parent, args, context) => context.prisma.user.findMany()
  }
};
