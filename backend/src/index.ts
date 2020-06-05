import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { LocationResolver } from "./resolvers/LocationResolver";
import { ActivityResolver } from "./resolvers/ActivityResolver";
import { AdResolver } from "./resolvers/AdResolver";

(async function main() {
  await createConnection();
  const schema = await buildSchema({
    resolvers: [UserResolver, LocationResolver, ActivityResolver, AdResolver]
  });
  const server = new ApolloServer({ schema });
  console.log("Server is starting!");
  await server.listen(4000);
  console.log("Server has started!");
})();
