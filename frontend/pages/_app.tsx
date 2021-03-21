import React from "react";
import cookie from "cookie";
import withApollo from "next-with-apollo";
import { ApolloProvider, InMemoryCache, HttpLink } from "@apollo/client";
import "react-datepicker/dist/react-datepicker.css";
// import { UserProvider } from "../components/UserProvider";
// import { CookiesProvider } from "react-cookie";
import {applyServerSidePropsCookie} from 'next-universal-cookie';

import { NextCookieProvider } from "next-universal-cookie";
import { useApollo } from "../lib/ApolloClient";
import MainLayout from "../components/MainLayout";

App.getInitialProps = async function(appContext) {
  console.log("🚀 ~ file: _app.tsx ~ line 15 ~ App.getInitialProps=function ~ App.getInitialProps");
  // const cookies = cookie.parse(appContext?.ctx?.req?.headers?.cookie || "");
  
  if (!appContext.ctx.req || !appContext.ctx.res) {
    console.log("req does not exist here");
    return { props: { cookies: {} } };
  }
  applyServerSidePropsCookie(appContext.ctx.req, appContext.ctx.res);
  const cookies = cookie.parse(appContext?.ctx?.req?.headers?.cookie || "");
  console.log("universalCookies = ", appContext?.ctx?.req.universalCookies);
  console.log("🚀 ~ file: _app.tsx ~ line 13 ~ App.getInitialProps=function ~ cookies", cookies);

  return { props: { cookies } };
};

export default function App({ Component, props, pageProps }) {
  const apolloClient = useApollo(pageProps?.initialApolloState);
  return (
    <ApolloProvider client={apolloClient}>
      <NextCookieProvider cookie={props.cookies}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </NextCookieProvider>
    </ApolloProvider>
  );
}
