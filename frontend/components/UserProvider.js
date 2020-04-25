import React, { Component } from "react";
import PropTypes from "prop-types";

const UserContext = React.createContext();

function UserProvider({ children, cookies }) {
  const logIn = ({ data, method }) => {
    if (!["oauth", "password"].includes(method))
      throw new Error("Auth method not recognized");
    const allowedFields = [
      "first_name",
      "last_name",
      "email",
      "token",
      "bio",
      "image",
      "id"
    ];

    const newState = { loggedIn: true };
    Object.entries(data).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        if (key === "first_name") newState["firstName"] = value;
        else if (key === "last_name") newState["lastName"] = value;
        else newState[key] = value;
      }
    });
    setState(newState);
    console.log(`Logged in as ${state.firstName} ${state.lastName}`);
    Object.entries(state).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  };

  const logOut = () => {
    setState(initialState);
    localStorage.clear();
  };

  const updateUser = (key, value) => {
    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "token",
      "bio",
      "image"
    ];
    if (!allowedFields.includes(key)) return;
    setState({ [key]: value });
    localStorage.setItem(key, value);
  };

  const { firstName, token } = cookies;
  return (
    <UserContext.Provider
      value={{ firstName, token, logIn, logOut, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/* then make a consumer which will surface it */
const UserConsumer = UserContext.Consumer;
export default UserProvider;
export { UserConsumer, UserContext, UserProvider };
