const { gql } = require("apollo-server-express");

export default gql`
  extend type Query {
    ad(id: ID!): Ad
    ads: [Ad]
  }

  extend type Mutation {
    ad(id: ID!): Ad
  }

  type Ad {
    id: String
    description: String
    activity: Activity
    location: Location
    user: User
    responses: [AdResponse]
  }

  type AdInput {
    description: String
    activity: ID
    location: ID
  }
`;
