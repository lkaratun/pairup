const { gql } = require("apollo-server-express");

export default gql`
  type Query {
    hello: String
    user: User
    users: [User]
    activity: Activity
    activities: [Activity]
    location: Location
    locations: [Location]
    ad: Ad
    ads: [Ad]
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
