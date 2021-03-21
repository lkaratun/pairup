import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    activitytype(id: ID!): ActivityType
    activityTypes: [ActivityType]
  }
  extend type Mutation {
    activitytype(id: ID!, data: ActivityTypeInput): ActivityType
    createActivityType(data: ActivityTypeInput): ActivityType
  }

  type ActivityType {
    id: ID!
    name: String!
    ads: [Ad]
  }

  input ActivityTypeInput {
    name: String
  }
`;
