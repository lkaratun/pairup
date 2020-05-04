const axios = require("axios");

export default axios.create({
  withCredentials: true
});
