const { gql } = require("apollo-server-express");

export default gql`
  extend type Query {
    activity(id: ID!): Activity
    activities: [Activity]
  }
  extend type Mutation {
    activity(id: ID!): Activity
  }

  type Activity {
    id: String
    name: String
    ads: [Ad]
  }

  type ActivityInput {
    name: String
  }
`;
