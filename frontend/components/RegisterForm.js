import React, { Component } from "react";
import styled from "styled-components";
import Router from "next/router";
import Input from "./Input";
import AuthButton from "./AuthButton";
import LoginButton from "./LoginButton";
import GoogleRegisterButton from "./GoogleRegisterButton";

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      email: "",
      passwordsDontMatch: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
  }

  handleAuth = (_, type) => {
    console.log(`Register with ${type}`);
    Router.push("/");
  };

  handleSubmit = e => {
    // Register new user
    e.preventDefault();

    // Perform password validation
    const { password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.setState({ passwordsDontMatch: true });
    } else {
      this.setState({ passwordsDontMatch: false });
    }

    // Handle failed register state
    // Handle Success register state -> redirect
  };

  handleInput(e) {
    // Method that syncs current input with state
    const { name, value } = e.target;
    const inputValue = { ...this.state, [name]: value };
    this.setState(inputValue);
  }

  render() {
    const { passwordsDontMatch } = this.state;
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First Name"
            handleChange={this.handleInput}
            required
          />
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            handleChange={this.handleInput}
            required
          />
          <Input id="email" name="email" type="email" placeholder="Email" handleChange={this.handleInput} required />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            handleChange={this.handleInput}
            required
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            handleChange={this.handleInput}
            required
          />
          <LoginButton title="Register" />
          {passwordsDontMatch && <StyledErrorMsg>Make sure that passwords match!</StyledErrorMsg>}
        </form>
        <AuthButtonWrapper>
          <h4>Or use alternatives:</h4>
          <GoogleRegisterButton
            theme="#ea4335"
            title="Register using Google"
            onCompletion={e => this.handleAuth(e, "gl")}
          />
          <AuthButton theme="#3b5998" title="Register using Facebook" onCompletion={e => this.handleAuth(e, "fb")} />
          <AuthButton theme="#1da1f2" title="Register using Twitter" onCompletion={e => this.handleAuth(e, "tw")} />
        </AuthButtonWrapper>
      </>
    );
  }
}

export default FormContainer;

const AuthButtonWrapper = styled.div`
  display: grid;
  border-top: 1px solid rgba(73, 73, 128, 0.52);
  margin-top: 20px;

  h4 {
    margin-bottom: 5px;
  }
`;

const StyledErrorMsg = styled.span`
  margin-left: 10px;
  color: red;
`;
