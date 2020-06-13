export default {
  Query: {
    ad: (parent, args, context, info) =>
      context.prisma.ad.findOne({
        where: { id: args.id }
      }),
    ads: (parent, args, context) => context.prisma.ad.findMany()
  },
  Mutation: {
    ad: async (parent, args, context) => {
      return context.prisma.ad.update({
        where: { id: args.id },
        data: args.data
      });
    }
  },
  Ad: {
    user: (parent, args, context, info) => {
      return (
        parent.userId &&
        context.prisma.user.findOne({
          where: {
            id: parent.userId
          }
        })
      );
    },
    activity: (parent, args, context, info) => {
      return (
        parent.activityId &&
        context.prisma.activity.findOne({
          where: {
            id: parent.activityId
          }
        })
      );
    },
    location: (parent, args, context, info) => {
      return (
        parent.locationId &&
        context.prisma.location.findOne({
          where: {
            id: parent.locationId
          }
        })
      );
    },
    responses: (parent, args, context, info) => {
      return (
        parent.locationId &&
        context.prisma.adResponse.findMany({
          where: {
            id: parent.responseId
          }
        })
      );
    }
  }
};
