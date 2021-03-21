import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    ad(id: ID!): Ad
    ads: [Ad]
  }

  extend type Mutation @AuthRequired {
    ad(id: ID!, data: ModifyAdInput): Ad @AuthRequired
    createAd(data: NewAdInput): Ad @AuthRequired
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
    activityId: ID
    locationId: ID
  }

  input NewAdInput {
    description: String
    imageUrl: String
    activityId: ID!
    locationId: ID!
  }
`;
