import React from "react";
import cookie from "cookie";
import { gql, useQuery } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";
import Profile from "../components/Profile";
import { useRouter } from "next/router";
import { FullUserInfo } from "types/User";

const GetCurrentUserQuery = gql`
  query GetCurrentUser {
    currentUser {
      userId: id
      firstName
      lastName
      bio
      email
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
      context: { headers: { cookie: cookies } }
    })
    .catch(console.error);
  console.log("🚀 ~ file: profile.tsx ~ line 31 ~ getServerSideProps ~ res", res);
  return { props: { initialApolloState: apolloClient.cache.extract() } };
}

function ProfilePage(props) {
  const { error, data } = useQuery(GetCurrentUserQuery);
  const router = useRouter();
  console.log("🚀 ~ file: profile.tsx ~ line 36 ~ ProfilePage ~ error", error);
  console.log("🚀 ~ file: profile.tsx ~ line 36 ~ ProfilePage ~ data", data);
  console.log("🚀 ~ file: profile.js ~ line 33 ~ ProfilePage ~ props", props);

  if (error) {
    console.log("Error, Returning empty page");
    return <>{error.message}</>;
  }
  
  if (!data?.currentUser) {
    console.log("No data, Returning empty page");
    return <>Please log in to view the page</>;
  }

  console.log("User found, returning normal page");
  return <Profile {...props} {...data} />;
}

export default ProfilePage;
