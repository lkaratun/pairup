import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
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

  const handleSubmit = e => {
    e.preventDefault();
    user
      .logIn({ email, password })
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
        <HalfWidthButton>Log in</HalfWidthButton>
        <HalfWidthButton
          type="button"
          onClick={() => router.push(`${backendUrl}/auth/google`)}
        >
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
