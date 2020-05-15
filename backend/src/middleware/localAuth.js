const { omit } = require("lodash");

const bcrypt = require("bcrypt");
const passport = require("passport");
const passportJWT = require("passport-jwt");

const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

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
        .unsafeRead()
        .then(async userData => {
          console.log({ userData });
          // no account found
          if (!userData) {
            console.log("no user found");
            return done("Incorrect username or password", null);
          }
          // account is oAuth if user db record has no password
          if (!userData.password)
            return done(
              "This account can be authenticated with google only",
              null
            );

          const passwordIsCorrect = await bcrypt.compare(
            password,
            userData.password
          );
          return passwordIsCorrect
            ? done(null, omit(userData, "password"))
            : done("Incorrect username or password", null);
        })
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
