const { gql } = require("apollo-server-express");

export default gql`
  extend type Mutation {
    logIn: User
  }
`;
