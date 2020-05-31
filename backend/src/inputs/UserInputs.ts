import { InputType, Field } from "type-graphql";

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  firstName: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  googleAccessToken?: string;

  @Field({ nullable: true })
  googleRefreshToken?: string;
}
