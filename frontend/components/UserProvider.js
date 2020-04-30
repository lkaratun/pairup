import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import config from "../config.json";

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;

const UserContext = React.createContext();

class UserProvider extends React.Component {
  state = {
    firstName: this.props.cookies.firstName,
    logIn: ({ data, method }) => {
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
    },

    logOut: () => {
      axios({
        url: `${backendUrl}/auth/logout`,
        withCredentials: true
      });
    },

    updateUser: (key, value) => {
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
    }
  };

  render() {
    const { children, cookies: existingCookies } = this.props;
    console.log("this.props.cookies = ", existingCookies);

    const firstNameValue = 0;
    const { firstName, token } = existingCookies;

    console.log("{ firstName, token }", { firstName, token });
    return (
      <UserContext.Provider value={{ ...this.state }}>
        {children}
      </UserContext.Provider>
    );
  }
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/* then make a consumer which will surface it */
const UserConsumer = UserContext.Consumer;
export default UserProvider;
export { UserConsumer, UserContext, UserProvider };
