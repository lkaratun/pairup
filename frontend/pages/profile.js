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
  const userId = cookie.parse(req?.headers?.cookie).userId;
  console.log("getServerSideProps -> userId", userId);
  if (!userId) return { props: { userData: {}, events: [] } };

  const apolloClient = initializeApollo();
  await apolloClient.query({ query: GetCurrentUserQuery }).catch(console.error);
  return { props: { initialApolloState: apolloClient.cache.extract() } };
}

function ProfilePage(props) {
  const { error, data } = useQuery(GetCurrentUserQuery);

  console.log("ProfilePage -> { error, data }", { error, data });
  if (error) {
    return <>{`An error has occurred:  ${error}`}</>;
  }
  return <Profile {...props} {...data} />;
}

export default ProfilePage;
