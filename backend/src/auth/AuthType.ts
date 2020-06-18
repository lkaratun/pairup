const { gql } = require("apollo-server-express");

export default gql`
  extend type Query {
    google: String
  }
`;
