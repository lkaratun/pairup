import { pickBy } from "lodash";

export default {
  Query: {
    ad: (parent, args, context, info): Promise<object> =>
      context.prisma.ad.findUnique({
        where: { id: args.id }
      }),
    ads: (parent, args, context) => context.prisma.ad.findMany()
  },
  Mutation: {
    ad: async (parent, args, context): Promise<object> => {
      return context.prisma.ad.update({
        where: { id: args.id },
        data: args.data
      });
    },
    createAd: (parent, args, context, info): Promise<object> => {
      const user: Object = args.data.userId && {
        connect: { id: args.data.userId }
      };
      const activity: Object = args.data.activityId && {
        connect: { id: args.data.activityId }
      };
      const location: Object = args.data.locationId && {
        connect: { id: args.data.locationId }
      };

      return context.prisma.ad.create(
        pickBy({
          data: {
            description: args.data.description,
            imageUrl: args.data.imageUrl,
            user,
            activity,
            location
          }
        }),
        x => x !== undefined && x !== null
      );
    }
  },
  Ad: {
    user: (parent, args, context, info): Promise<object> => {
      return (
        parent.userId &&
        context.prisma.user.findUnique({
          where: {
            id: parent.userId
          }
        })
      );
    },
    activity: (parent, args, context, info): Promise<object> => {
      return (
        parent.activityId &&
        context.prisma.activity.findUnique({
          where: {
            id: parent.activityId
          }
        })
      );
    },
    location: (parent, args, context, info): Promise<object> => {
      return (
        parent.locationId &&
        context.prisma.location.findUnique({
          where: {
            id: parent.locationId
          }
        })
      );
    },
    responses: (parent, args, context, info): Promise<object> => {
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
