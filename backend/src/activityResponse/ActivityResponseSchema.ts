import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    activityResponse(id: ID!): ActivityResponse
    activityResponses: [ActivityResponse]
  }

  extend type Mutation {
    createActivityResponse(data: NewActivityResponseInput): ActivityResponse
    deleteActivityResponse(id: ID!): ActivityResponse
  }

  type ActivityResponse {
    id: String!
    activity: Activity!
    user: User!
  }

  input NewActivityResponseInput {
    activityId: ID!
    userId: ID!
  }
`;
