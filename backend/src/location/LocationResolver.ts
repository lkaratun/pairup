export default {
  Query: {
    location: (parent, args, context, info) => {
      console.log("location resolver");
      return context.prisma.location.findOne({
        where: {
          id: args.id
        }
      });
    },
    locations: (parent, args, context) => context.prisma.location.findMany()
  }
};
