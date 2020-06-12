// import User from "../entities/User";
// import { CreateUser, UpdateUser } from "../inputs/UserInputs";

// export class UserResolver {
//   @Query(() => [User])
//   users() {
//     return User.find();
//   }

//   @Query(() => User)
//   user(@Arg("id") id: string) {
//     return User.findOne({ where: { id } });
//   }

//   @Mutation(() => User)
//   async createUser(@Arg("data") data: CreateUser) {
//     const user = User.create(data);
//     return user.save();
//   }

//   @Mutation(() => User)
//   async updateUser(@Arg("id") id: string, @Arg("data") data: UpdateUser) {
//     const user = await User.findOne({ where: { id } });
//     if (!user) throw new Error("User not found!");
//     Object.assign(user, data);
//     return user.save();
//   }

//   @Mutation(() => Boolean)
//   async deleteUser(@Arg("id") id: string) {
//     const user = await User.findOne({ where: { id } });
//     if (!user) throw new Error("User not found!");
//     await user.remove();
//     return true;
//   }

//   // @FieldResolver()
//   // averageRating(@Root() recipe: User) {
//   //   const ratingsSum = recipe.ratings.reduce((a, b) => a + b, 0);
//   //   return recipe.ratings.length ? ratingsSum / recipe.ratings.length : null;
//   // }
// }
