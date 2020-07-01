import React from "react";
import Cookie from "cookie";
import withApollo from "next-with-apollo";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import "react-datepicker/dist/react-datepicker.css";
import { UserProvider } from "../components/UserProvider";
import { useApollo } from "../lib/apolloClient";
import MainLayout from "../components/MainLayout";

App.getInitialProps = async function(appContext) {
  const cookies = Cookie.parse(appContext?.ctx?.req?.headers?.cookie || "");
  return { props: { cookies } };
};

function App({ Component, props, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider cookies={props?.cookies}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </UserProvider>
    </ApolloProvider>
  );
}

export default withApollo(({ initialState }) => {
  return new ApolloClient({
    uri: "http://api.local.pair-up.net:4000/graphql",
    cache: new InMemoryCache().restore(initialState || {})
  });
})(App);
