const bcrypt = require("bcrypt");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const ApiError = require("../utils/APIError");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET env.var missing!");
const secret = process.env.JWT_SECRET;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, done) => {
      console.log("In local strategy");
      const user = new User({ email });
      console.log({ user });

      return user
        .read()
        .then(([userData]) => {
          console.log({ userData });

          // refuse to authenticate if user db record has no password
          if (!userData.password) {
            throw new ApiError(
              "This account can be authenticated with google only",
              403
            );
          }
          return bcrypt.compare(password, userData.password) ? userData : null;
        })
        .then(
          userData =>
            console.log({ userData }) ||
            (userData
              ? done(null, userData)
              : done("Incorrect username or password", null))
        )
        .catch(err => done(err, null));
    }
  )
);

const cookieExtractor = req => req && req.cookies && req.cookies.token;

passport.use(
  "userRequired",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
      secretOrKey: secret
    },
    async (token, done) => {
      console.log("token = ", token);

      const user = new User({ id: token.id });
      user
        .read()
        .then(userData => done(null, userData))
        .catch(err => {
          console.error("Error in userRequired middleware: ", err);
          done(err, false);
        });
    }
  )
);

passport.use(
  "getUserDataFromToken",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
      secretOrKey: secret
    },
    async (token, done) => {
      console.log("token in JWT middleware = ", token);
      return done(null, token);
    }
  )
);

module.exports.userOptional = function(req, res, next) {
  passport.authenticate("getUserDataFromToken", function(err, user, info) {
    console.log("In error handler");
    console.log({ err, user, info_msg: info && info.message });
    req.user = user || {};
    return next(err);
  })(req, res, next);
};
