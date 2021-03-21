import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    activityType(id: ID!): ActivityType
    activityTypes: [ActivityType]
  }
  extend type Mutation {
    activityType(id: ID!, data: ActivityTypeInput): ActivityType
    createActivityType(data: ActivityTypeInput): ActivityType
  }

  type ActivityType {
    id: ID!
    name: String!
    activities: [Activity]
  }

  input ActivityTypeInput {
    name: String
  }
`;
