import React from "react";
import cookie from "cookie";
import UserProvider from "../components/UserProvider";

MyApp.getInitialProps = async function getServerSideProps({ ctx }) {
  const existingCookies = cookie.parse(ctx?.req?.headers?.cookie || "");

  return { props: { cookies: existingCookies } };
};

function MyApp({ Component, props, pageProps }) {
  console.log("pageProps = ", pageProps);

  return (
    <UserProvider {...props} {...pageProps}>
      <Component />
    </UserProvider>
  );
}

export default MyApp;
