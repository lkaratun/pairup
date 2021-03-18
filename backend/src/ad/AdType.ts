import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    ad(id: ID!): Ad
    ads: [Ad]
  }

  extend type Mutation {
    ad(id: ID!, data: ModifyAdInput): Ad
    createAd(data: NewAdInput): Ad
  }

  type Ad {
    id: String
    description: String
    activity: Activity
    location: Location
    user: User
    responses: [AdResponse]
  }

  input ModifyAdInput {
    description: String
    imageUrl: String
    userId: ID
    activityId: ID
    locationId: ID
  }

  input NewAdInput {
    description: String
    imageUrl: String
    userId: ID!
    activityId: ID!
    locationId: ID!
  }
`;
