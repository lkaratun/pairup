import React, { useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";
import { useCookie } from "next-universal-cookie";
import styled from "styled-components";
import { UserContext } from "components/UserProvider";
import Input from "./Input";
import LoginButton from "./LoginButton";
import StyledErrorMsg from "../styles/StyledErrorMsg";
import config from "../config.json";

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const user = useContext(UserContext);
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookie(["firstName", "userId"]);

  const logIn = useCallback(async function({ email, password }) {
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

  const handleSubmit = e => {
    e.preventDefault();
    logIn({ email, password })
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
        <HalfWidthButton type="button" onClick={() => router.push(`${backendUrl}`)}>
          Log in with Google
        </HalfWidthButton>
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
