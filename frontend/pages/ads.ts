import React from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { initializeApollo } from "../lib/apolloClient";
import Ad from "../components/Ad";
import { ads as adsQuery } from "../queries/ads/ads";

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo();
  await apolloClient.query({ query: adsQuery });
  return { props: { initialApolloState: apolloClient.cache.extract() } };
}

function Ads({ ads }) {
  const { error, data } = useQuery(adsQuery);
  if (error) return `Error fetching ads data: ${error}`;

  return (
    <Container>
      <Header>Ads</Header>
      {data.ads.map(ad => (
        <Ad key={ad.id} ad={ad} />
      ))}
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
