import React from "react";
import cookie from "cookie";
import { gql, useQuery } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";
import Profile from "../components/Profile";

const GetCurrentUserQuery = gql`
  query GetCurrentUser {
    currentUser {
      id
      firstName
      bio
    }
  }
`;

export async function getServerSideProps({ req }) {
  const cookies = req?.headers?.cookie ?? "";
  const { userId } = cookie.parse(cookies);
  if (!userId) return { props: { userData: {}, events: [] } };

  const apolloClient = initializeApollo();
  const res = await apolloClient
    .query({
      query: GetCurrentUserQuery,
      context: {
        headers: {
          cookie: cookies
        }
      }
    })
    .catch(console.error);
  return { props: { initialApolloState: apolloClient.cache.extract() } };
}

function ProfilePage(props) {
  const { error, data } = useQuery(GetCurrentUserQuery);

  if (error) {
    return <>{`An error has occurred:  ${error}`}</>;
  }
  return <Profile {...props} {...data} />;
}

export default ProfilePage;
