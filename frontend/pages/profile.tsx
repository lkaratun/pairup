import React, { useCallback } from "react";
import cookie from "cookie";
import { gql, useQuery, useMutation } from "@apollo/client";
import { initializeApollo } from "../lib/ApolloClient";
import Profile from "../components/Profile";
import { useCookie } from "next-universal-cookie";
import { User, UserInput } from "generated-types";

const GetCurrentUserQuery = gql`
  query GetCurrentUser {
    currentUser {
      id
      firstName
      lastName
      bio
      email
      activities {
        id
      }
      activityResponses {
        id
      }
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

function ProfilePage(props: { currentUser: User }) {
  const { error, data } = useQuery(GetCurrentUserQuery);
  const [cookies, setCookie, removeCookie] = useCookie(["firstName", "userId"]);
  const [mutate, mutationResponse] = useMutation(updateUserMutation);

  const updateUser = useCallback(
    async function(newData: UserInput) {
      if (Object.keys(newData).length === 0) return null;
      const id = data.currentUser.id;

      const response = await mutate({
        variables: { id, data: newData }
      });

      setCookie("firstName", response.data.user.firstName);
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
