import React, { useState } from "react";
// import { useRouter } from "next/router";
import axios from "axios";
import Input from "./Input";
import TextArea from "./TextArea";
import LoginButton from "./LoginButton";
import StyledErrorMsg from "../styles/StyledErrorMsg";
import config from "../config.json";

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;

function RegisterForm() {
  // const router = useRouter();
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
        `${backendUrl}/auth/register`,
        {
          email: state.email,
          password: state.password,
          first_name: state.firstName,
          last_name: state.lastName,
          bio: state.bio
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      )
      .then(res => {
        // props.context.logIn({ data: res.data, method: "password" });
        // Cookies.set("token", res.data.token);
        // router.push("/");
      })
      .catch(err => {
        console.error(err.response);
        setState({ ...state, registrationFailed: true, failReason: err.response.data.message });
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
        <Input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="First Name"
          onChange={handleInput}
          required
        />
        <p> Optional fields:</p>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Last Name"
          onChange={handleInput}
        />
        <TextArea placeholder="Short Bio" onChange={handleInput} />
        <LoginButton text="Register" />
        {registrationFailed && (
          <StyledErrorMsg>Registration failed. Reason: {state.failReason}</StyledErrorMsg>
        )}
      </form>
    </>
  );
}

export default RegisterForm;
