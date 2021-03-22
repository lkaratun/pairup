import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcrypt";
import addMonths from "date-fns/addMonths";
import config from "../../config.json";
import jwt from "jsonwebtoken";
import UserResolver from "../user/UserResolver";
import { authenticateGoogle } from "./passport";

const SECRET = process.env.JWT_SECRET;
const JWT_EXP_THRESHOLD = process.env.JWT_EXP_THRESHOLD || "60d";
if (!SECRET) throw new Error("JWT_SECRET env.var missing!");

const { FRONTEND_DOMAIN } = config[process.env.NODE_ENV];

function setAuthCookies(context, { token, userId, firstName }) {
  context.res.cookie("token", token, {
    expires: addMonths(new Date(), 1),
    httpOnly: true,
    domain: FRONTEND_DOMAIN
  });
}

function clearAuthCookies(context) {
  context.res.clearCookie("token", { domain: FRONTEND_DOMAIN });
}

interface User {
  userId: string;
}

export default {
  Query: {
    currentUser: async (parent, args, context, info) => {
      console.log("🚀 ~ file: AuthResolver.ts ~ line 34 ~ currentUser: ~ currentUser");
      console.log("🚀 ~ file: AuthResolver.ts ~ line 36 ~ currentUser: ~ cookies", context.req.cookies);
      const { token } = context.req.cookies;
      console.log("🚀 ~ file: AuthResolver.ts ~ line 36 ~ currentUser: ~ token", token);
      if (!token) return null;
      let userId: string;
      let user: User;
      try {
        userId = (jwt.verify(token, SECRET) as User).userId;
        user = await context.prisma.user.findUnique(
          { where: { id: userId } },
          { include: { activities: true, activityResponses: true } }
        );
        console.log("🚀 ~ file: AuthResolver.ts ~ line 47 ~ currentUser: ~ user", user);
      } catch (err) {
        console.log("there is no user");
        clearAuthCookies(context);
        throw new AuthenticationError("Authentication token has expired, please log in again");
      }
      console.log("🚀 ~ file: AuthResolver.ts ~ line 58 ~ currentUser: ~ user");
      if (!user) throw new AuthenticationError("User with the given userId was not found");
      return user;
    }
  },
  Mutation: {
    register: async (parent, args, context, info) => {
      const { email, password, firstName } = args.data;
      const passwordHash = await bcrypt.hash(password, 14);
      const user = await context.prisma.user
        .create({ data: { email, password: passwordHash, firstName } })
        .catch(err => {
          if (err.code === "P2002") throw new Error("User with the given email already exists");
          else throw err;
        });
      const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: JWT_EXP_THRESHOLD });
      setAuthCookies(context, { token, userId: user.id, firstName: user.firstName });
      context.userId = user.id;
      return user;
    },
    logIn: async (parent, args, context, info) => {
      const { email, password } = args;

      console.log("🚀 ~ file: AuthResolver.ts ~ line 79 ~ logIn: ~ context.prisma", context.prisma);
      const user = await context.prisma.user.findUnique({ where: { email } });
      if (!user) throw new AuthenticationError("User with the given email was not found");
      const passwordIsCorrect = await bcrypt.compare(password, user.password);
      if (!passwordIsCorrect) throw new AuthenticationError("Password is incorrect");
      const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: JWT_EXP_THRESHOLD });
      setAuthCookies(context, { token, userId: user.id, firstName: user.firstName });
      context.userId = user.id;
      return user;
    },
    googleLogIn: async (parent, args, context) => {
      context.req.body = {
        ...context.req.body,
        access_token: args.accessToken
      };

      try {
        // data contains accessToken, refreshToken and profile from passport
        const { data, info } = await authenticateGoogle(context.req, context.res);

        // error
        if (info) {
          console.error(info);
          switch (info.code) {
            case 'ETIMEDOUT':
              return (new Error('Failed to reach Google: Try Again'));
            default:
              return (new Error('something went wrong'));
          }
        }

        // eslint-disable-next-line camelcase
        const { email, given_name, family_name, picture } = data.profile._json;
        const { accessToken } = data;
        console.log("🚀 ~ file: AuthResolver.ts ~ line 101 ~ googleLogIn: ~ email", email);
        const user = await context.prisma.user.upsert({
          where: { email },
          update: { googleAccessToken: accessToken },
          create: {
            email,
            googleAccessToken: accessToken,
            firstName: given_name,
            lastName: family_name,
            image: picture
          }
        });

        if (!user) throw new AuthenticationError("User with the given email was not found");
        const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: JWT_EXP_THRESHOLD });
        setAuthCookies(context, { token, userId: user.id, firstName: user.firstName });
        context.userId = user.id;
        return user;
      } catch (error) {
        console.error("🚀 ~ file: AuthResolver.ts ~ googleLogIn: ~ error", error);
        return error;
      }
    },
    logOut: async (parent, args, context, info) => {
      clearAuthCookies(context);
    }
  },
  User: UserResolver.User
};
