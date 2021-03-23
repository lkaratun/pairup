import { gql, useMutation } from "@apollo/client";
import { useCookie } from "next-universal-cookie";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import GoogleLogin from "react-google-login";
import styled from "styled-components";
import config from "../../config.json";
import { initializeApollo } from "../../lib/ApolloClient";
import StyledErrorMsg from "../../styles/StyledErrorMsg";
import Input from "../shared/Input";
import LoginButton from "../logIn/LoginButton";

const googleClientId = config[process.env.NODE_ENV].GOOGLE_CLIENT_ID;

const registerMutation = gql`
  mutation register($data: RegisterInput!) {
    register(data: $data) {
      id
      email
      firstName
      password
    }
  }
`;

export default function RegisterForm() {
  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const [firstName, setFirstName] = useState<String>("");
  const [loginFailed, setLoginFailed] = useState<boolean>(false);
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookie(["firstName", "userId"]);
  const [mutate] = useMutation(registerMutation);

  const register = useCallback(async function({ email, password, firstName }) {
    const {
      data: { register: logInData }
    } = await mutate({ variables: { data: { email, password, firstName } } });
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
    register({ email, password, firstName })
      .then(() => router.push("/"))
      .catch(err => {
        console.error(err);
        setLoginFailed(true);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          id="firstName"
          name="firstName"
          type="firstName"
          placeholder="First name"
          onChange={e => setFirstName(e.target.value)}
          required
        />
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
        <GoogleLogin clientId={googleClientId} onSuccess={googleLogIn} onFailure={console.error}>
          Sign in with Google
        </GoogleLogin>
      </form>
    </>
  );
}

const HalfWidthButton = styled(LoginButton)`
  width: 49%;
  &:first-of-type {
    margin-right: 2%;
  }
`;
