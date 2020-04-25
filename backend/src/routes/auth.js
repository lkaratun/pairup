const passport = require("passport");
const express = require("express");
const User = require("../models/User");
require("../middleware/googleAuth");
require("../middleware/localAuth");
const addMonths = require("date-fns/addMonths");
const omit = require("lodash/omit");
const config = require("../../config.json");

const router = express.Router();

const { FRONTEND_DOMAIN, FRONTEND_URL } = config[process.env.NODE_ENV];
console.log({ env: process.env.NODE_ENV, FRONTEND_DOMAIN, FRONTEND_URL });

function loginSuccessRedirect(req, res) {
  const token = new User(req.user).refreshToken();
  console.log("new token = ", token);

  res
    .cookie("token", token, {
      expires: addMonths(new Date(), 1),
      httpOnly: true
    })
    .cookie("firstName", req.user.first_name, {
      expires: addMonths(new Date(), 1),
      domain: FRONTEND_DOMAIN
    })
    .cookie("userId", req.user.id, {
      expires: addMonths(new Date(), 1),
      domain: FRONTEND_DOMAIN
    });
  res.redirect(FRONTEND_URL);
}

// Create an account using google oAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    session: true
  })
);

// Send JWT back to front end
router.get(
  "/googleAuthSuccess",
  passport.authenticate("google"),
  loginSuccessRedirect
);

// Test route to view current user info and token
router.get("/view", (req, res) => {
  console.log("in /view handler!!");

  res.send({
    cookies: req.cookies,
    user: req.user,
    reqHeaders: req.headers,
    resHeaders: res.headers,
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    referer_domain: req.headers.referer && req.headers.referer.split("/")[2],
    referer_url:
      req.headers.referer && /https?:\/\/.*\//.exec(req.headers.referer)[0]
  });
});

// Register using login/password
router.post("/register", (req, res) => {
  const { password } = req.body;
  // ToDo: replace with proper validation
  if (!password) {
    return res.status(400).json({ message: "password not set" });
  }
  const user = new User(req.body);
  user
    .create()
    .then(() => {
      res.status(201).json({ ...user.data, token: user.refreshToken() });
    })
    .catch(err => {
      res.status(err.statusCode || 500).json({ message: err.message });
    });
});

// Log in using username/password
router.post("/login", passport.authenticate("userRequired"), (req, res) => {
  console.log("In login route");
  console.log(req.user);

  const token = new User({ id: req.user.id }).refreshToken();
  res.status(201).json({ ...req.user, token });
});

// Log out
router.get("/logout", (req, res) => {
  console.log("In logout route");
  res
    .clearCookie("token")
    .clearCookie("firstName", { domain: FRONTEND_DOMAIN })
    .clearCookie("userId", { domain: FRONTEND_DOMAIN })
    .status(204)
    .send("User is logged out");
});

// Get user data from token
router.get(
  "/getUserFromToken",
  function(req, res, next) {
    console.log("Entered getUserFromToken handler2");

    passport.authenticate("getUserDataFromToken", function(err, user, info) {
      console.log("In error handler");
      console.log({ err, user, info_msg: info && info.message });
      // if (user === false && info && info.message === "No auth token") return next();
      req.user = user || {};
      return next(err);
    })(req, res, next);
  },
  (req, res) => {
    console.log("In getUserFromToken route!");
    console.log("req.user = ", req.user);

    res.send(req.user);
  }
);

module.exports = router;
