import { InputType, Field } from "type-graphql";

@InputType()
export class CreateActivity {
  @Field()
  name: string;
}

@InputType()
export class UpdateActivity {
  @Field()
  name: string;
}
