import React from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { initializeApollo } from "../lib/ApolloClient";
import { useRouter } from "next/router";
import ActivityDisplay from "../components/Activity";
import { ActivityType, NewActivityResponseInput } from "generated-types";

import { gql } from "@apollo/client";

export const getAds = gql`
  query GetAds {
    activities {
      id
      description
      activityType {
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


export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo();
  await apolloClient.query({ query: getAds });
  return { props: { initialApolloState: apolloClient.cache.extract() } };
}

function Activities() {
  const { error, data, loading, refetch } = useQuery(getAds);
  const router = useRouter();
  if (error) return `Error fetching activities data: ${error}`;

  return (
    <Container>
      <Header>Activities</Header>
      {data.activities.map(activity => (
        <ActivityDisplay key={activity.id} activity={activity} refetch={refetch} loading={loading}/>
      ))}
      <button onClick={() => router.push("/createActivityType")}>Create a new activityType</button>
    </Container>
  );
}

export default Activities;

const Header = styled.h1`
  margin: 1rem auto;
  flex-basis: 100%;
`;

const Container = styled.div`
  max-width: 80vw;
  margin: 50px auto;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  text-align: center;
`;
