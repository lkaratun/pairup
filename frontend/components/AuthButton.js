import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const AuthButton = props => {
  const { theme, onClick, title } = props;
  return (
    <StyledAuthBtn theme={theme} onClick={onClick}>
      {title}
    </StyledAuthBtn>
  );
};

AuthButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired
};

export default AuthButton;

const StyledAuthBtn = styled.button`
  border: 0;
  padding: 10px;
  margin-top: 5px;
  cursor: pointer;
  border-radius: 2px;
  color: white;
  background: ${props => props.theme};
  font-size: 1rem;
`;
