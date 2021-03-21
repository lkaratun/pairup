import React from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { initializeApollo } from "../lib/ApolloClient";
import { useRouter } from "next/router";
import Ad from "../components/Ad";
import { Ad as AdType, NewAdResponseInput } from "generated-types";

import { gql } from "@apollo/client";

export const getAds = gql`
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


export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo();
  await apolloClient.query({ query: getAds });
  return { props: { initialApolloState: apolloClient.cache.extract() } };
}

function Ads() {
  const { error, data, loading, refetch } = useQuery(getAds);
  const router = useRouter();
  if (error) return `Error fetching ads data: ${error}`;

  return (
    <Container>
      <Header>Ads</Header>
      {data.ads.map(ad => (
        <Ad key={ad.id} ad={ad} refetch={refetch} loading={loading}/>
      ))}
      <button onClick={() => router.push("/createActivity")}>Create a new activity</button>
    </Container>
  );
}

export default Ads;

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
