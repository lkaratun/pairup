import { InputType, Field } from "type-graphql";

@InputType()
export class CreateEventInput {
  @Field()
  name: string;

  @Field()
  authorId: string;
}

@InputType()
export class UpdateEventInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String, { nullable: true })
  image: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  activityId: string;

  @Field(() => String, { nullable: true })
  locationId: string;

  @Field(() => String, { nullable: true })
  dateFrom: string;

  @Field(() => String, { nullable: true })
  dateTo: string;

  @Field(() => String, { nullable: true })
  minPeople: number;

  @Field(() => String, { nullable: true })
  maxPeople: number;
}
