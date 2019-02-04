import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Input = props => {
  const { name, type, handleChange, placeholder, required } = props;
  return (
    <div>
      <label htmlFor={name}>
        <InputField
          id={name}
          name={name}
          type={type}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
        />
      </label>
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  required: PropTypes.bool
};

export default Input;

const InputField = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  padding: 5px;
  background-color: #fafafa;
  width: 100%;
  margin-bottom: 5px;
  font-size: 1rem;
`;
