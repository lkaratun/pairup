import { InputType, Field } from "type-graphql";

@InputType()
export class CreateActivityInput {
  @Field()
  name: string;
}

@InputType()
export class UpdateActivityInput {
  @Field()
  name: string;
}
