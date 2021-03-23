import { ApolloProvider } from "@apollo/client";
import cookie from "cookie";
import { applyServerSidePropsCookie, NextCookieProvider } from "next-universal-cookie";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import MainLayout from "../components/layout/MainLayout";
import { useApollo } from "../lib/ApolloClient";

App.getInitialProps = async function(appContext) {
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
