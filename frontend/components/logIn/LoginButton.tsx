import React from "react";
import { WideButton } from "../shared/Buttons";

const LoginButton = (props: {children: string}) => {
  const { children } = props;
  return <WideButton {...props}>{children}</WideButton>;
};

export default LoginButton;
