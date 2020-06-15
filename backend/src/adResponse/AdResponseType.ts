const { gql } = require("apollo-server-express");

export default gql`
  extend type Query {
    adResponse(id: ID!): AdResponse
    adResponses: [AdResponse]
  }

  extend type Mutation {
    createAdResponse(data: NewAdResponseInput): AdResponse
  }

  type AdResponse {
    id: String
    ad: Ad
    user: User
  }

  input NewAdResponseInput {
    adId: ID
    userId: ID
  }
`;
