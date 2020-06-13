const { gql } = require("apollo-server-express");

export default gql`
  extend type Query {
    adResponse(id: ID!): AdResponse
    adResponses: [AdResponse]
  }

  extend type Mutation {
    adResponse(id: ID!): AdResponse
  }

  type AdResponse {
    id: String
    ad: Ad
    adId: String
    user: User
    userId: String
  }
`;
