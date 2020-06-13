const { gql } = require("apollo-server-express");

export default gql`
  extend type Query {
    location(id: ID!): Location
    locations: [Location]
  }

  extend type Mutation {
    location(id: ID!): Location
  }

  type Location {
    id: String
    city: String
    country: String
    ads: [Ad]
  }

  type LocationInput {
    city: String
    country: String
  }
`;
