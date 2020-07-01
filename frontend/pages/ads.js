import React from "react";
import { gql } from "@apollo/client";
import styled from "styled-components";
import { initializeApollo } from "../lib/apolloClient";
import Ad from "../components/Ad";

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo();

  const ads = await apolloClient.query({
    query: gql`
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
    `
  });
  return { props: { ads: ads.data.ads } };
}

function Ads({ ads }) {
  return (
    <Container>
      <Header>Ads</Header>
      {ads.map(ad => (
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
