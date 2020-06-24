const { gql } = require("apollo-server-express");

export default gql`
  directive @authRequired on FIELD_DEFINITION
  extend type Query {
    user(id: ID!): User
    users: [User]
  }
  extend type Mutation {
    user(id: ID!, data: UserInput): User
  }

  type User {
    id: String
    email: String @authRequired
    bio: String
    firstName: String
    googleAccessToken: String
    googleRefreshToken: String
    image: String
    lastName: String
    password: String
    ads: [Ad]
    adResponses: [AdResponse]
  }

  input UserInput {
    email: String
    bio: String
    firstName: String
    image: String
    lastName: String
  }
`;
