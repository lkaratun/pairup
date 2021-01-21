import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { gql, useMutation } from "@apollo/client";
import cookie from "cookie";
import { initializeApollo } from "../lib/apolloClient";
import axios from "../utils/request.js";
import config from "../config.json";

const backendUrlFull = config[process.env.NODE_ENV].BACKEND_URL_FULL;

const UserContext = React.createContext();

function UserProvider({ cookies, children }) {
  const [firstName, setFirstName] = useState(cookies?.firstName);
  const [userId, setUserId] = useState(parseInt(cookies?.userId, 10));

  const updateFirstName = name => {
    if (!name) document.cookie = cookie.serialize("firstName", "", { maxAge: 0 });
    else document.cookie = cookie.serialize("firstName", name);
    setFirstName(name);
  };

  const updateUserId = id => {
    if (!id) document.cookie = cookie.serialize("firstName", "", { maxAge: 0 });
    document.cookie = cookie.serialize("userId", id ?? null);
    setUserId(id);
  };

  const logIn = useCallback(
    async function({ email, password }) {
      const logInMutation = gql`
        mutation logIn($email: String!, $password: String!) {
          logIn(email: $email, password: $password) {
            firstName
            email
            id
            password
          }
        }
      `;

      const apolloClient = initializeApollo();
      const {
        data: { logIn: logInData }
      } = await apolloClient.mutate({ mutation: logInMutation, variables: { email, password } });
      setFirstName(logInData.firstName);
      setUserId(logInData.id);
      console.log(`Logged in as ${firstName}`);
    },
    [firstName]
  );

  const logOut = useCallback(async function() {
    const logOutMutation = gql`
      mutation {
        logOut
      }
    `;
    const apolloClient = initializeApollo();
    await apolloClient.mutate({ mutation: logOutMutation });
    updateFirstName(undefined);
    updateUserId(undefined);
  }, []);

  const setUser = useCallback(async function({ newFirstName, newId }) {
    updateFirstName(newFirstName);
    updateUserId(newId);
    console.log(`Logged in as ${newFirstName}`);
  }, []);

  const updateUser = useCallback(async function(newData) {
    if (Object.keys(newData).length === 0) return null;
    const response = await axios
      .put(`${backendUrlFull}/users`, newData)
      .then(res => res.data)
      .catch(err => console.error(err.response));
    this.setState(response);
    return response;
  }, []);

  return (
    <UserContext.Provider value={{ firstName, userId, logIn, logOut, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/* then make a consumer which will surface it */
const UserConsumer = UserContext.Consumer;
export { UserConsumer, UserContext, UserProvider };
