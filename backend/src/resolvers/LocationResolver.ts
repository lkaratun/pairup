import { Resolver, Query, Mutation, Arg } from "type-graphql";
import Location from "../entities/Location";
import { CreateLocation, UpdateLocation } from "../inputs/LocationInputs";

@Resolver()
export class LocationResolver {
  @Query(() => [Location])
  locations() {
    return Location.find();
  }

  @Query(() => Location)
  location(@Arg("id") id: string) {
    return Location.findOne({ where: { id } });
  }

  @Mutation(() => Location)
  async createLocation(@Arg("data") data: CreateLocation) {
    const location = Location.create(data);
    return location.save();
  }

  @Mutation(() => Location)
  async updateLocation(
    @Arg("id") id: string,
    @Arg("data") data: UpdateLocation
  ) {
    const location = await Location.findOne({ where: { id } });
    if (!location) throw new Error("Location not found!");
    Object.assign(location, data);
    return location.save();
  }

  @Mutation(() => Boolean)
  async deleteLocation(@Arg("id") id: string) {
    const location = await Location.findOne({ where: { id } });
    if (!location) throw new Error("Location not found!");
    await location.remove();
    return true;
  }
}
