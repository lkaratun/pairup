import { Resolver, Query, Mutation, Arg } from "type-graphql";
import Activity from "../entities/Activity";
import { CreateActivity, UpdateActivity } from "../inputs/ActivityInputs";

@Resolver()
export class ActivityResolver {
  @Query(() => [Activity])
  activities() {
    return Activity.find();
  }

  @Query(() => Activity)
  activity(@Arg("id") id: string) {
    return Activity.findOne({ where: { id } });
  }

  @Mutation(() => Activity)
  async createActivity(@Arg("data") data: CreateActivity) {
    const activity = Activity.create(data);
    return activity.save();
  }

  @Mutation(() => Activity)
  async updateActivity(
    @Arg("id") id: string,
    @Arg("data") data: UpdateActivity
  ) {
    const activity = await Activity.findOne({ where: { id } });
    if (!activity) throw new Error("Activity not found!");
    Object.assign(activity, data);
    return activity.save();
  }

  @Mutation(() => Boolean)
  async deleteActivity(@Arg("id") id: string) {
    const activity = await Activity.findOne({ where: { id } });
    if (!activity) throw new Error("Activity not found!");
    await activity.remove();
    return true;
  }
}
