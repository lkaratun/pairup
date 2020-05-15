import React from "react";
import PropTypes from "prop-types";
import axios from "../utils/request.js";
import config from "../config.json";

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;

const UserContext = React.createContext();

class UserProvider extends React.Component {
  state = {
    firstName: this.props.cookies.firstName,
    id: parseInt(this.props.cookies.userId, 10),

    logIn: async ({ email, password }) => {
      const { firstName, id } = await axios
        .post(`http:${backendUrl}/auth/login`, {
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
        url: `http:${backendUrl}/auth/logout`
      });
      this.setState({ firstName: undefined, id: undefined });
    },

    updateUser: async newData => {
      if (Object.keys(newData).length === 0) return null;
      const response = await axios
        .put(`http:${backendUrl}/users`, newData)
        .then(res => res.data)
        .catch(err => console.error(err.response));
      this.setState(response);
      return response;
    }
  };

  render() {
    const { children, cookies: existingCookies } = this.props;
    console.log("this.props.cookies = ", existingCookies);

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
