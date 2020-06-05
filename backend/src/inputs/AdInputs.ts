import { InputType, Field } from "type-graphql";

@InputType()
export class CreateAd {
  @Field()
  user: string;

  @Field()
  activity: string;

  @Field({ nullable: true })
  location: string;
}

@InputType()
export class UpdateAd {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  activity: string;

  @Field({ nullable: true })
  location: string;
}
