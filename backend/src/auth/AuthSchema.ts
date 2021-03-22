import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    currentUser: User
  }

  extend type Mutation {
    register(data: RegisterInput!): User
    logIn(email: String!, password: String!): User
    googleLogIn(accessToken: String!): User
    logOut: Boolean
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
  }
`;
