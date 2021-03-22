import passport from "passport";
import { Strategy as GoogleTokenStrategy } from "passport-google-token";

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientID) throw new Error("GOOGLE_CLIENT_ID env.var missing!");
if (!clientSecret) throw new Error("GOOGLE_CLIENT_SECRET env.var missing!");

const GoogleTokenStrategyCallback = (accessToken, refreshToken, profile, done) =>
  done(null, {
    accessToken,
    refreshToken,
    profile
  });

passport.use(
  new GoogleTokenStrategy(
    {
      clientID,
      clientSecret
    },
    GoogleTokenStrategyCallback
  )
);

interface googleResponse {
  accessToken: string;
  profile: {
    _json: {
      email: string;
      given_name: string;
      family_name: string;
      picture: string;
    };
  };
}

export const authenticateGoogle = (req, res): Promise<{ data: googleResponse; info: {code: string;} }> =>
  new Promise((resolve, reject) => {
    passport.authenticate("google-token", { session: false }, (err, data, info) => {
      if (err) reject(err);
      resolve({ data, info });
    })(req, res);
  });
