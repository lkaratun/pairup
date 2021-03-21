import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    activity(id: ID!): Activity
    activities: [Activity]
  }

  extend type Mutation @AuthRequired {
    activity(id: ID!, data: ModifyActivityInput): Activity @AuthRequired
    createAd(data: NewActivityInput): Activity @AuthRequired
  }

  type Activity {
    id: String
    description: String
    activityType: ActivityType
    location: Location
    user: User
    responses: [ActivityResponse]
  }

  input ModifyActivityInput {
    description: String
    imageUrl: String
    activityTypeId: ID
    locationId: ID
  }

  input NewActivityInput {
    description: String
    imageUrl: String
    activityTypeId: ID!
    locationId: ID!
  }
`;
