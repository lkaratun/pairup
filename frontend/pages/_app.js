import React from "react";
import cookie from "cookie";
import UserProvider from "../components/UserProvider";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "universal-cookie";

MyApp.getInitialProps = async function({ ctx }) {
  const cookies = new Cookies(ctx?.req?.headers?.cookie);
  return { props: { cookies: cookies.cookies } };
};

function MyApp({ Component, props, pageProps }) {
  return (
    <UserProvider cookies={props.cookies}>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
