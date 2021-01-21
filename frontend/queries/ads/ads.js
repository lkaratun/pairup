import { gql } from "@apollo/client";

export const ads = gql`
  query GetAds {
    ads {
      id
      description
      activity {
        id
        name
      }
      responses {
        id
        user {
          firstName
        }
      }
    }
  }
`;
