import { Resolver, Query, Mutation, Arg } from "type-graphql";
import Ad from "../entities/Ad";
import {
  CreateAd,
  UpdateAd,
  createAdResponse,
  removeAdResponse
} from "../inputs/AdInputs";
import User from "../entities/User";
import AdResponse from "../entities/AdResponse";
import Activity from "../entities/Activity";

@Resolver()
export class AdResolver {
  @Query(() => [Ad])
  ads() {
    return Ad.find({
      relations: ["user", "activity", "responses", "responses.user"]
    });
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

  @Mutation(() => AdResponse)
  async createAdResponse(@Arg("data") data: createAdResponse) {
    const ad = Ad.create({ id: data.adId });
    const user = User.create({ id: data.userId });
    const adResponse = AdResponse.create({ ad, user });
    return adResponse.save();
  }

  @Mutation(() => Boolean)
  async removeAdResponse(@Arg("id") id: string) {
    const adResponse = await AdResponse.findOne({ where: { id } });
    if (!adResponse) throw new Error("Ad response not found!");
    await adResponse.remove();
    return true;
  }
}
