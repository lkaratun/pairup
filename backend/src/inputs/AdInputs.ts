import { InputType, Field, ID } from "type-graphql";

@InputType()
export class CreateAd {
  @Field()
  userId: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  activityId: string;

  @Field({ nullable: true })
  locationId: string;
}

@InputType()
export class UpdateAd {
  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  activity: string;

  @Field({ nullable: true })
  location: string;
}

@InputType()
export class RespondToAd {
  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  adId: string;
}
