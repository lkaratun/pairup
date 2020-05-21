import config from "../config.json";

const axios = require("axios");

const backendUrlFull = config[process.env.NODE_ENV].BACKEND_URL_FULL;

export default axios.create({
  withCredentials: true
});

export const serverSideRequest = req =>
  axios.create({
    baseURL: `${backendUrlFull}`,
    headers: { cookie: req?.headers?.cookie || "" }
  });
