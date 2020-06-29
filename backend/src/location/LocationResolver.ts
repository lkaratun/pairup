export default {
  Query: {
    location: (parent, args, context, info) => {
      console.log("location resolver");
      return context.prisma.location.findOne({
        where: { id: args.id }
      });
    },
    locations: (parent, args, context) => context.prisma.location.findMany()
  },
  Mutation: {
    location: async (parent, args, context) => {
      return context.prisma.location.update({
        where: { id: args.id },
        data: args.data
      });
    },
    createLocation: (parent, args, context, info) => {
      return context.prisma.location.create(args);
    }
  }
};
