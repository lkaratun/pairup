import React from "react";
import PropTypes from "prop-types";
import { WideButton } from "./shared/Buttons";

const LoginButton = props => {
  const { children } = props;
  return <WideButton {...props}>{children}</WideButton>;
};

LoginButton.propTypes = {
  text: PropTypes.string.isRequired
};

export default LoginButton;
