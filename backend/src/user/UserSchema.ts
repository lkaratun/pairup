import { gql } from "apollo-server-express";

export default gql`
  directive @AuthRequired on FIELD_DEFINITION | OBJECT
  extend type Query {
    user(id: ID!): User
    users: [User]
  }
  extend type Mutation {
    user(id: ID!, data: UserInput): User
  }

  type User {
    id: String!
    email: String
    bio: String
    firstName: String
    googleAccessToken: String
    googleRefreshToken: String
    image: String
    lastName: String
    activities: [Activity]
    activityResponses: [ActivityResponse]
  }

  input UserInput {
    email: String
    bio: String
    firstName: String
    image: String
    lastName: String
  }
`;
