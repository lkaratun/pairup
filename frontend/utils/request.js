import config from "../config.json";

const axios = require("axios");

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;

export default axios.create({
  withCredentials: true
});

export const serverSideRequest = req =>
  axios.create({
    baseURL: `http:${backendUrl}`,
    headers: { cookie: req?.headers?.cookie || "" }
  });
