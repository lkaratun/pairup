export default {
  Query: {
    adResponses: (parent, args, context) =>
      context.prisma.adResponse.findMany(),
    adResponse: (parent, args, context, info) =>
      context.prisma.adResponse.findOne({
        where: {
          id: args.id
        }
      })
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
