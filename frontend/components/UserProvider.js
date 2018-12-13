import React, { Component } from "react";
import PropTypes from "prop-types";

const UserContext = React.createContext();
class UserProvider extends Component {
  state = {
    loggedIn: false,
    firstName: null,
    lastName: null,
    email: null
  };

  componentDidMount() {
    this.setState({
      loggedIn: localStorage.getItem("loggedIn") === "true",
      firstName: localStorage.getItem("firstName"),
      lastName: localStorage.getItem("lastName"),
      email: localStorage.getItem("email")
    });
  }

  logIn = ({ data, method = "password" }) => {
    console.log(data);
    if (!["oauth", "password"].includes(method)) throw new Error("Auth method not recognized");

    if (method === "oauth") {
      this.setState({ loggedIn: true, firstName: data.givenName, lastName: data.familyName, email: data.email });
    } else if (method === "password") {
      this.setState({ loggedIn: true, firstName: data.first_name, lastName: data.last_name, email: data.email });
    }
    console.log(`Logged in as ${this.state.firstName} ${this.state.lastName}`);
    Object.entries(this.state).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    localStorage.setItem("loggedIn", "true");
  };

  logOut = () => {
    this.setState({ loggedIn: false, firstName: null, lastName: null, email: null });
    localStorage.clear();
  };

  updateUser = newName => {
    this.setState({ user: newName });
  };

  render() {
    return (
      <UserContext.Provider value={{ ...this.state, logIn: this.logIn, logOut: this.logOut }}>
        {this.props.children}
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
export { UserConsumer };
