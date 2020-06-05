import { Resolver, Query, Mutation, Arg } from "type-graphql";
import Ad from "../entities/Ad";
import { CreateAd, UpdateAd } from "../inputs/AdInputs";
import User from "../entities/User";
import Activity from "../entities/Activity";

@Resolver()
export class AdResolver {
  @Query(() => [Ad])
  ads() {
    return Ad.find({ relations: ["user"] });
  }

  @Query(() => Ad)
  ad(@Arg("id") id: string) {
    return Ad.findOne({ where: { id } });
  }

  @Mutation(() => Ad)
  async createAd(@Arg("data") data: CreateAd) {
    const { userId, activityId } = data;
    const user = User.create({ id: userId });
    const activity = Activity.create({ id: activityId });
    const ad = Ad.create({ user, activity });
    return ad.save();
  }

  @Mutation(() => Ad)
  async updateAd(@Arg("id") id: string, @Arg("data") data: UpdateAd) {
    const ad = await Ad.findOne({ where: { id } });
    if (!ad) throw new Error("Ad not found!");
    Object.assign(ad, data);
    return ad.save();
  }

  @Mutation(() => Boolean)
  async deleteAd(@Arg("id") id: string) {
    const ad = await Ad.findOne({ where: { id } });
    if (!ad) throw new Error("Ad not found!");
    await ad.remove();
    return true;
  }
}
