const { gql } = require("apollo-server-express");

export default gql`
  extend type Query {
    activity(id: ID!): Activity
    activities: [Activity]
  }
  extend type Mutation {
    activity(id: ID!, data: ActivityInput): Activity
  }

  type Activity {
    id: String
    name: String
    ads: [Ad]
  }

  input ActivityInput {
    name: String
  }
`;
