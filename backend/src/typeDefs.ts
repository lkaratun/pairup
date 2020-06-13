const { gql } = require("apollo-server-express");

export default gql`
  type Query {
    user(id: ID!): User
    users: [User]
    activity(id: ID!): Activity
    activities: [Activity]
    location(id: ID!): Location
    locations: [Location]
    ad(id: ID!): Ad
    ads: [Ad]
    adResponse(id: ID!): AdResponse
    adResponses: [AdResponse]
  }

  type Mutation {
    user(id: ID!, data: UserInput): User
    activity(id: ID!): Activity
    location(id: ID!): Location
    ad(id: ID!): Ad
    adResponse(id: ID!): AdResponse
  }

  type User {
    id: String
    email: String
    bio: String
    firstName: String
    googleAccessToken: String
    googleRefreshToken: String
    image: String
    lastName: String
    password: String
    ads: [Ad]
    adResponses: [AdResponse]
  }

  input UserInput {
    email: String
    bio: String
    firstName: String
    image: String
    lastName: String
  }

  type Activity {
    id: String
    name: String
    ad: Ad
  }

  type Location {
    id: String
    city: String
    country: String
    ad: [Ad]
  }

  type Ad {
    id: String
    description: String
    activity: Activity
    location: Location
    user: User
    responses: [AdResponse]
  }

  type AdResponse {
    id: String
    ad: Ad
    adId: String
    user: User
    userId: String
  }
`;
