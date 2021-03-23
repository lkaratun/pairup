import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "utils/request";
import Input from "./Input";
import TextArea from "./TextArea";
import LoginButton from "./LoginButton";
import StyledErrorMsg from "../styles/StyledErrorMsg";
import config from "../config.json";

const backendUrlFull = config[process.env.NODE_ENV].BACKEND_URL_FULL;

function RegisterForm() {
  const router = useRouter();
  const user = useContext(UserContext);
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    password: "",
    email: "",
    registrationFailed: false,
    failReason: ""
  });

  const handleSubmit = async e => {
    e.preventDefault();

    // Handle Success register state -> redirect
    axios
      .post(
        `${backendUrlFull}/auth/register`,
        {
          email: state.email,
          password: state.password,
          firstName: state.firstName,
          lastName: state.lastName,
          bio: state.bio
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      )
      .then(res => {
        console.log("RegisterForm -> res", res);
        user.setUser({ ...res.data });
        router.push("/");
      })
      .catch(err => {
        console.log("err = ", err);

        setState({
          ...state,
          registrationFailed: true,
          failReason: err.response.data.message
        });
      });
  };

  const handleInput = e => {
    // Method that syncs current input with state
    const { name, value } = e.target;
    const inputValue = { ...state, [name]: value };
    setState(inputValue);
  };

  const { registrationFailed } = state;
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="Email"
          onChange={handleInput}
          required
          value={state.email}
        />
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Password"
          onChange={handleInput}
          required
        />
        <Input id="firstName" name="firstName" type="text" placeholder="First Name" onChange={handleInput} required />
        <p> Optional fields:</p>
        <Input id="lastName" name="lastName" type="text" placeholder="Last Name" onChange={handleInput} />
        <TextArea placeholder="Short Bio" onChange={handleInput} />
        <LoginButton>Register</LoginButton>
        {registrationFailed && <StyledErrorMsg>Registration failed. Reason: {state.failReason}</StyledErrorMsg>}
      </form>
    </>
  );
}

export default RegisterForm;
