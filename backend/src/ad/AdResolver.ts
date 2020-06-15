import { pickBy } from "lodash";

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
    },
    createAd: async (parent, args, context, info) => {
      const user = args.data.userId && { connect: { id: args.data.userId } };
      const activity = args.data.activityId && {
        connect: { id: args.data.activityId }
      };
      const location = args.data.locationId && {
        connect: { id: args.data.locationId }
      };

      const res = await context.prisma.ad
        .create(
          pickBy({
            data: {
              description: args.data.description,
              user,
              activity,
              location
            }
          }),
          x => x !== undefined && x !== null
        )
        .catch(e => console.error(e));
      return res;
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
