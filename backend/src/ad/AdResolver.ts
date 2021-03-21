import { pickBy } from "lodash";

export default {
  Query: {
    ad: (parent, args, context, info): Promise<Record<string, unknown>> =>
      context.prisma.ad.findUnique({
        where: { id: args.id }
      }),
    ads: (parent, args, context) => context.prisma.ad.findMany({include: {responses: true}})
  },
  Mutation: {
    ad: async (parent, args, context): Promise<Record<string, unknown>> => {
      return context.prisma.ad.update({
        where: { id: args.id },
        data: args.data
      });
    },
    createAd: (parent, args, context, info): Promise<Record<string, unknown>> => {
    console.log("🚀 ~ file: AdResolver.ts ~ line 19 ~ context.userId", context.userId);
      const user: Record<string, unknown> = context.userId && {
        connect: { id: context.userId }
      };
      const activitytype: Record<string, unknown> = args.data.activitytypeId && {
        connect: { id: args.data.activitytypeId }
      };
      const location: Record<string, unknown> = args.data.locationId && {
        connect: { id: args.data.locationId }
      };

      return context.prisma.ad.create(
        pickBy({
          data: {
            description: args.data.description,
            imageUrl: args.data.imageUrl,
            user,
            activitytype,
            location
          }
        }),
        x => x !== undefined && x !== null
      );
    }
  },
  Ad: {
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
    activitytype: (parent, args, context, info): Promise<Record<string, unknown>> => {
      return (
        parent.activitytypeId &&
        context.prisma.activitytype.findUnique({
          where: {
            id: parent.activitytypeId
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
