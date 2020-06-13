export default {
  Ad: {
    user: (parent, args, context, info) => {
      return context.prisma.user.findOne({
        where: {
          id: parent.userId
        }
      });
    },
    activity: (parent, args, context, info) => {
      return context.prisma.activity.findOne({
        where: {
          id: parent.activityId
        }
      });
    },
    location: (parent, args, context, info) => {
      return context.prisma.location.findOne({
        where: {
          id: parent.locationId
        }
      });
    },
    responses: (parent, args, context, info) => {
      return context.prisma.adResponse.findMany({
        where: {
          id: parent.responseId
        }
      });
    }
  }
};
