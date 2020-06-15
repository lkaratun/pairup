const { gql } = require("apollo-server-express");

export default gql`
  extend type Query {
    ad(id: ID!): Ad
    ads: [Ad]
  }

  extend type Mutation {
    ad(id: ID!, data: AdInput): Ad
    createAd(data: AdInput): Ad
  }

  type Ad {
    id: String
    description: String
    activity: Activity
    location: Location
    user: User
    responses: [AdResponse]
  }

  input AdInput {
    description: String
    userId: ID!
    activityId: ID!
    locationId: ID
  }
`;
