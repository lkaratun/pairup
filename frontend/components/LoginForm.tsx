import React, { useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { initializeApollo } from "../lib/ApolloClient";
import { useCookie } from "next-universal-cookie";
import styled from "styled-components";
import { UserContext } from "components/UserProvider";
import Input from "./Input";
import LoginButton from "./LoginButton";
import StyledErrorMsg from "../styles/StyledErrorMsg";
import config from "../config.json";
import GoogleLogin from "react-google-login";

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;
const googleClientId = config[process.env.NODE_ENV].GOOGLE_CLIENT_ID;

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const user = useContext(UserContext);
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookie(["firstName", "userId"]);

  const emailPasswordLogIn = useCallback(async function({ email, password }) {
    const logInMutation = gql`
      mutation logIn($email: String!, $password: String!) {
        logIn(email: $email, password: $password) {
          firstName
          email
          id
          password
        }
      }
    `;

    const apolloClient = initializeApollo();
    const {
      data: { logIn: logInData }
    } = await apolloClient.mutate({ mutation: logInMutation, variables: { email, password } });
    setCookie("firstName", logInData.firstName);
    setCookie("userId", logInData.id);
  }, []);
  
  const googleLogIn = useCallback(async function({ accessToken }) {
    const logInMutation = gql`
      mutation googleLogIn($accessToken: String!) {
        googleLogIn(accessToken: $accessToken) {
          firstName
          email
          id
          password
        }
      }
    `;

    const apolloClient = initializeApollo();
    const {
      data: { googleLogIn: logInData }
    } = await apolloClient.mutate({ mutation: logInMutation, variables: { accessToken } });
    setCookie("firstName", logInData.firstName);
    setCookie("userId", logInData.id);
    router.push("/");
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    emailPasswordLogIn({ email, password })
      .then(() => router.push("/"))
      .catch(err => {
        console.error(err.response);
        setLoginFailed(true);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          required
        />
        {loginFailed && <StyledErrorMsg>Log in failed!</StyledErrorMsg>}
        <HalfWidthButton type="submit">Log in</HalfWidthButton>
        <GoogleLogin
          clientId={googleClientId}
          onSuccess={googleLogIn}
          onFailure={console.error}
        >
          Log in with Google
        </GoogleLogin>
      </form>
    </>
  );
};

const HalfWidthButton = styled(LoginButton)`
  width: 49%;
  &:first-of-type {
    margin-right: 2%;
  }
`;
