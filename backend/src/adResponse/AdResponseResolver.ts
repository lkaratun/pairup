export default {
  Query: {
    adResponses: (parent, args, context) =>
      context.prisma.adResponse.findMany(),
    adResponse: (parent, args, context, info) =>
      context.prisma.adResponse.findOne({
        where: { id: args.id }
      })
  },
  Mutation: {
    createAdResponse: (parent, args, context, info) => {
      return context.prisma.adResponse.create({
        data: {
          ad: { connect: { id: args.data.adId } },
          user: { connect: { id: args.data.userId } }
        }
      });
    },
    deleteAdResponse: (parent, args, context, info) => {
      console.log("args", args);
      return context.prisma.adResponse.delete({
        where: { id: args.id }
      });
    }
  },
  AdResponse: {
    ad: (parent, args, context, info) => {
      return context.prisma.ad.findOne({
        where: {
          id: parent.adId
        }
      });
    },
    user: (parent, args, context, info) => {
      return context.prisma.user.findOne({
        where: {
          id: parent.userId
        }
      });
    }
  }
};
