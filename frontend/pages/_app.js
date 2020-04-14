import React from "react";
import cookie from "cookie";
import UserProvider from "../components/UserProvider";

// export async function getServerSideProps(ctx) {
//   const { firstName, lastName, email } = ctx.req.headers.cookie;
//   console.log("Headers = ", ctx.req.headers);

//   return {
//     props: { firstName, lastName, email } // will be passed to the page component as props
//   };
// }

MyApp.getInitialProps = async function getServerSideProps({ ctx }) {
  // console.log("ctx = ", ctx);
  console.log("query = ", ctx.query);
  // const cookies = context.req.getHeader("Cookie");
  console.log("headers = ", ctx.req.headers);
  console.log("headers.cookie = ", ctx.req.headers.cookie);
  // console.log("parsed cookies = ", cookie.parse(ctx.req.headers.cookie));
  const existingCookies = ctx.req.headers.cookie && cookie.parse(ctx.req.headers.cookie);
  console.log("In IndexPage -> getServerSideProps");
  console.log("existingCookies.firstNam = ", existingCookies && existingCookies.firstName);

  return { props: { cookies: existingCookies } };
  // return {
  //   props: { firstName, lastName, email } // will be passed to the page component as props
  // };
};

function MyApp({ Component, props, pageProps }) {
  console.log("pageProps = ", pageProps);

  return (
    <UserProvider {...props} {...pageProps}>
      <Component />
    </UserProvider>
  );
}

// class MyApp extends React.Component {
//   render() {
//     const { Component, pageProps } = this.props;
//     return (
//       <UserProvider {...pageProps}>
//         <Component />
//       </UserProvider>
//     );
//   }
// }

export default MyApp;
