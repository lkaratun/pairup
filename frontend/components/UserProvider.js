import React from "react";
import PropTypes from "prop-types";
import axios from "../utils/request.js";
import config from "../config.json";

const backendUrlFull = config[process.env.NODE_ENV].BACKEND_URL_FULL;

const UserContext = React.createContext();

class UserProvider extends React.Component {
  state = {
    firstName: this.props?.cookies?.firstName,
    id: parseInt(this.props?.cookies?.userId, 10),

    logIn: async ({ email, password }) => {
      const { firstName, id } = await axios
        .post(`${backendUrlFull}/auth/login`, {
          email,
          password
        })
        .then(res => res.data)
        .catch(err => {
          console.error(err.response);
        });

      this.setState({ firstName, id });
      console.log(`Logged in as ${firstName}`);
    },

    logOut: async () => {
      await axios({
        url: `${backendUrlFull}/auth/logout`
      });
      this.setState({ firstName: undefined, id: undefined });
    },

    setUser: ({ firstName, id }) => {
      this.setState({ firstName, id });
      console.log(`Logged in as ${firstName}`);
    },

    updateUser: async newData => {
      if (Object.keys(newData).length === 0) return null;
      const response = await axios
        .put(`${backendUrlFull}/users`, newData)
        .then(res => res.data)
        .catch(err => console.error(err.response));
      this.setState(response);
      return response;
    }
  };

  render() {
    const { children, cookies: existingCookies } = this.props;
    return <UserContext.Provider value={{ ...this.state }}>{children}</UserContext.Provider>;
  }
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/* then make a consumer which will surface it */
const UserConsumer = UserContext.Consumer;
export { UserConsumer, UserContext, UserProvider };
