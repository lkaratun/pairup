import React, { Component } from "react";
import styled from "styled-components";
import { gql } from "@apollo/client";
import device from "../styles/device";

Ads.getInitialProps = ctx => {
  console.log("getServerSideProps -> ctx", ctx);
  ctx.apolloClient
    .query({
      query: gql`
        query GetUsers {
          users {
            id
            firstName
          }
        }
      `
    })
    .then(result => console.log("query result = ", result.data));
  return {};
};

function Ads() {
  return "Ads page";
}

export default Ads;
