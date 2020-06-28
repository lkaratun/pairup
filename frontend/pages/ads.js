import React, { Component } from "react";
import { gql } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo();

  const ads = await apolloClient.query({
    query: gql`
      query GetUsers {
        users {
          id
          firstName
        }
      }
    `
  });
  // .then(result => console.log("query result = ", result.data));
  console.log("query result = ", ads.data);
  return { props: { ads: ads.data } };
}

function Ads({ ads }) {
  return `Ads page, ads = ${JSON.stringify(ads)} `;
}

export default Ads;
