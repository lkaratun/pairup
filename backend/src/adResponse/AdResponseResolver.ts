export default {
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
