import { InputType, Field } from "type-graphql";

@InputType()
export class CreateLocation {
  @Field()
  country: string;

  @Field()
  city: string;
}

@InputType()
export class UpdateLocation {
  @Field()
  country: string;

  @Field()
  city: string;
}
