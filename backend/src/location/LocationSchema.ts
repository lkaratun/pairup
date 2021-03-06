import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    location(id: ID!): Location
    locations: [Location]
  }

  extend type Mutation {
    location(id: ID!, data: LocationInput): Location
    createLocation(data: LocationInput!): Location
  }

  type Location {
    id: ID!
    city: String
    country: String
    activities: [Activity]
  }

  input LocationInput {
    city: String
    country: String
  }
`;
