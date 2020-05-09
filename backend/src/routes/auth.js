const passport = require("passport");
const express = require("express");
const User = require("../models/User");
require("../middleware/googleAuth");
require("../middleware/localAuth");
const { userOptional } = require("../middleware/localAuth.js");
const addMonths = require("date-fns/addMonths");
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
      httpOnly: true,
      domain: FRONTEND_DOMAIN
    })
    .cookie("firstName", req.user.firstName, {
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
router.post(
  "/register",
  (req, res, next) => {
    const { password } = req.body;
    // ToDo: replace with proper validation
    if (!password) {
      return res.status(400).json({ message: "password not set" });
    }
    const user = new User(req.body);
    return user
      .create()
      .then(() => {
        req.user = user.data;
        res.status(201);
        next();
      })
      .catch(err => {
        res.status(err.statusCode || 500).json({ message: err.message });
      });
  },
  loginSuccessRedirect
);

// Log in using username/password
router.post(
  "/login",
  passport.authenticate("userRequired"),
  (req, res, next) => {
    console.log("In login route");
    console.log(req.user);
    res.status(201);
    return next();
  },
  loginSuccessRedirect
);

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
router.get("/getUserFromToken", userOptional, (req, res) => {
  console.log("In getUserFromToken route!");
  console.log("req.user = ", req.user);

  res.send(req.user);
});

module.exports = router;
