import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from "../entity/User";
import { CreateUserInput } from "../inputs/CreateUserInput";

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "world";
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => User)
  async createUser(@Arg("data") data: CreateUserInput) {
    const user = User.create(data);
    await user.save();
    return user;
  }
}
