import config from "../config.json";
import { initializeApollo } from "../lib/ApolloClient";

const axios = require("axios");

const backendUrlFull = config[process.env.NODE_ENV].BACKEND_URL_FULL;

export default axios.create({
  withCredentials: true
});

export const serverSideRequest = req =>
  axios.create({
    baseURL: `${backendUrlFull}`,
    headers: { cookie: req?.headers?.cookie || "" },
    method: "post"
  });

// export const serverSideGqlRequest = (body, { type = "query" }) => {
//   const apolloClient = initializeApollo();
//   const isQuery = Object.keys(body).includes("query");
//   const isMutation = Object.keys(body).includes("mutation");
//   if (isQuery && isMutation) throw new Error("You can't perform a query and a mutation at the same time");

//   if (isQuery) return apolloClient.query(body);
//   if (isMutation) return apolloClient.mutate(body);
//   return null;
// };
