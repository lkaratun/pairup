import { pickBy } from "lodash";

export default {
  Query: {
    activity: (parent, args, context, info): Promise<Record<string, unknown>> =>
      context.prisma.activity.findUnique({
        where: { id: args.id }
      }),
    activities: (parent, args, context) => context.prisma.activity.findMany({include: {responses: true}})
  },
  Mutation: {
    activity: async (parent, args, context): Promise<Record<string, unknown>> => {
      return context.prisma.activity.update({
        where: { id: args.id },
        data: args.data
      });
    },
    createAd: (parent, args, context, info): Promise<Record<string, unknown>> => {
    console.log("🚀 ~ file: ActivityResolver.ts ~ line 19 ~ context.userId", context.userId);
      const user: Record<string, unknown> = context.userId && {
        connect: { id: context.userId }
      };
      const activityType: Record<string, unknown> = args.data.activityTypeId && {
        connect: { id: args.data.activityTypeId }
      };
      const location: Record<string, unknown> = args.data.locationId && {
        connect: { id: args.data.locationId }
      };

      return context.prisma.activity.create(
        pickBy({
          data: {
            description: args.data.description,
            imageUrl: args.data.imageUrl,
            user,
            activityType,
            location
          }
        }),
        x => x !== undefined && x !== null
      );
    }
  },
  Activity: {
    user: (parent, args, context, info): Promise<Record<string, unknown>> => {
      return (
        parent.userId &&
        context.prisma.user.findUnique({
          where: {
            id: parent.userId
          }
        })
      );
    },
    activityType: (parent, args, context, info): Promise<Record<string, unknown>> => {
      return (
        parent.activityTypeId &&
        context.prisma.activityType.findUnique({
          where: {
            id: parent.activityTypeId
          }
        })
      );
    },
    location: (parent, args, context, info): Promise<Record<string, unknown>> => {
      return (
        parent.locationId &&
        context.prisma.location.findUnique({
          where: {
            id: parent.locationId
          }
        })
      );
    }
  }
};
