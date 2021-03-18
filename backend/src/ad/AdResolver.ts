import { pickBy } from "lodash";

export default {
  Query: {
    ad: (parent, args, context, info): Promise<Record<string, unknown>> =>
      context.prisma.ad.findUnique({
        where: { id: args.id }
      }),
    ads: (parent, args, context) => context.prisma.ad.findMany({include: {responses: {select: {id: true}}}})
  },
  Mutation: {
    ad: async (parent, args, context): Promise<Record<string, unknown>> => {
      return context.prisma.ad.update({
        where: { id: args.id },
        data: args.data
      });
    },
    createAd: (parent, args, context, info): Promise<Record<string, unknown>> => {
      const user: Record<string, unknown> = args.data.userId && {
        connect: { id: args.data.userId }
      };
      const activity: Record<string, unknown> = args.data.activityId && {
        connect: { id: args.data.activityId }
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
            activity,
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
    activity: (parent, args, context, info): Promise<Record<string, unknown>> => {
      return (
        parent.activityId &&
        context.prisma.activity.findUnique({
          where: {
            id: parent.activityId
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
    },
    responses: async (parent, args, context, info): Promise<Record<string, unknown>> => {
      console.log("🚀 ~ file: AdResolver.ts ~ line 84 ~ parent", parent);
      const result = await  (
        parent.responses.length > 0 ?
        context.prisma.adResponse.findMany({
          where: {
            adId: parent.id
          }
        }) : []
      );
      console.log("🚀 ~ file: AdResolver.ts ~ line 84 ~ result", result);
      return result;
    }
  }
};
