const { gql } = require("apollo-server-express");

export default gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;