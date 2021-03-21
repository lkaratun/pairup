export default {
  Query: {
    activityResponses: (parent, args, context) => context.prisma.activityResponse.findMany(),
    activityResponse: (parent, args, context, info) =>
      context.prisma.activityResponse.findUnique({
        where: { id: args.id }
      })
  },
  Mutation: {
    createActivityResponse: (parent, args, context, info) => {
      return context.prisma.activityResponse.create({
        data: {
          activity: { connect: { id: args.data.activityId } },
          user: { connect: { id: args.data.userId } }
        }
      });
    },
    deleteActivityResponse: (parent, args, context, info) => {
      console.log("args", args);
      return context.prisma.activityResponse.delete({
        where: { id: args.id }
      });
    }
  },
  ActivityResponse: {
    activity: (parent, args, context, info) => {
      return context.prisma.activity.findUnique({
        where: {
          id: parent.activityId
        }
      });
    },
    user: (parent, args, context, info) => {
      return context.prisma.user.findUnique({
        where: {
          id: parent.userId
        }
      });
    }
  }
};
