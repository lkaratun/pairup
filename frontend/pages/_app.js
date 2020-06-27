import React from "react";
import Cookie from "cookie";
import withApollo from "next-with-apollo";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import "react-datepicker/dist/react-datepicker.css";
import App from "next/app";
import { merge } from "lodash";
import { UserProvider } from "../components/UserProvider";

MyApp.getInitialProps = async function(appContext) {
  const cookies = Cookie.parse(appContext?.ctx?.req?.headers?.cookie);
  const appProps = await App.getInitialProps(appContext);
  console.log("merge(appProps, { props: { cookies } })", merge(appProps, { props: { cookies } }));
  return merge(appProps, { props: { cookies } });
};

function MyApp({ Component, props, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <UserProvider cookies={props.cookies}>
        <Component {...pageProps} />
      </UserProvider>
    </ApolloProvider>
  );
}

export default withApollo(({ initialState }) => {
  return new ApolloClient({
    uri: "http://api.local.pair-up.net:4000/graphql",
    cache: new InMemoryCache().restore(initialState || {})
  });
})(MyApp);
