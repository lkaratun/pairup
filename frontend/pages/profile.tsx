import React, { useCallback } from "react";
import cookie from "cookie";
import { gql, useQuery, useMutation } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";
import Profile from "../components/Profile";
import { useRouter } from "next/router";
import { FullUserInfo } from "types/User";
import { useCookie } from "next-universal-cookie";

const GetCurrentUserQuery = gql`
  query GetCurrentUser {
    currentUser {
      id
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

const updateUserMutation = gql`
  mutation updateUser($data: UserInput!, $id: ID!) {
    user(data: $data, id: $id) {
      firstName
      lastName
      email
      bio
      id
    }
  }
`;

function ProfilePage(props: { currentUser: FullUserInfo }) {
  const { error, data } = useQuery(GetCurrentUserQuery);
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookie(["firstName", "userId"]);
  const [mutate, mutationResponse] = useMutation(updateUserMutation);
  console.log("🚀 ~ file: profile.tsx ~ line 36 ~ ProfilePage ~ error", error);
  console.log("🚀 ~ file: profile.tsx ~ line 36 ~ ProfilePage ~ data", data);
  console.log("🚀 ~ file: profile.js ~ line 33 ~ ProfilePage ~ props", props);

  const { lastName, email, image, bio, firstName, id: userId } = data.currentUser;

  const updateUser = useCallback(
    async function(newData) {
      if (Object.keys(newData).length === 0) return null;

      console.log("🚀 ~ file: UserProvider.js ~ line 90 ~ updateUser ~ userId", userId);
      const response = await mutate({
        variables: { id: userId, data: newData }
      });

      setCookie("firstName", response.data.user.firstName);
      console.log("🚀 ~ file: profile.tsx ~ line 71 ~ function ~ response.data.user", response.data.user);
      return response.data.user;
    },

    []
  );

  if (error) {
    console.log("Error, returning empty page");
    return <>{error.message}</>;
  }

  if (!data?.currentUser) {
    console.log("No data, returning empty page");
    return <>Please log in to view the page</>;
  }

  console.log("User found, returning normal page. User = ", data.currentUser);
  return <Profile {...props} {...data} updateUser={updateUser} />;
}

export default ProfilePage;
