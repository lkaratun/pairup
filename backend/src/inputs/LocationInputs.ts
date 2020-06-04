import { InputType, Field } from "type-graphql";

@InputType()
export class CreateLocationInput {
  @Field()
  country: string;

  @Field()
  city: string;
}

@InputType()
export class UpdateLocationInput {
  @Field()
  country: string;

  @Field()
  city: string;
}
