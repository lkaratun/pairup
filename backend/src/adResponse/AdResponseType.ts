const { gql } = require("apollo-server-express");

export default gql`
  extend type Query {
    adResponse(id: ID!): AdResponse
    adResponses: [AdResponse]
  }

  type AdResponse {
    id: String
    ad: Ad
    user: User
  }
`;
