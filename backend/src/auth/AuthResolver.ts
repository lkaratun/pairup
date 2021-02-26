import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcrypt";
import addMonths from "date-fns/addMonths";
import config from "../../config.json";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const JWT_EXP_THRESHOLD = process.env.JWT_EXP_THRESHOLD || "60d";
if (!SECRET) throw new Error("JWT_SECRET env.var missing!");

const { FRONTEND_DOMAIN, FRONTEND_URL } = config[process.env.NODE_ENV];

function setAuthCookies(res, { token, userId, firstName }) {
  res
    .cookie("token", token, {
      expires: addMonths(new Date(), 1),
      httpOnly: true,
      domain: FRONTEND_DOMAIN
    })
    .cookie("firstName", firstName, {
      expires: addMonths(new Date(), 1),
      domain: FRONTEND_DOMAIN
    })
    .cookie("userId", userId, {
      expires: addMonths(new Date(), 1),
      domain: FRONTEND_DOMAIN
    });
}

function clearAuthCookies(context) {
  context.res
    .clearCookie("token", { domain: FRONTEND_DOMAIN })
    .clearCookie("firstName", { domain: FRONTEND_DOMAIN })
    .clearCookie("userId", { domain: FRONTEND_DOMAIN });
}


export default {
  Query: {
    currentUser: async (parent, args, context, info) => {
      console.log("🚀 ~ file: AuthResolver.ts ~ line 34 ~ currentUser: ~ currentUser");
      console.log("🚀 ~ file: AuthResolver.ts ~ line 36 ~ currentUser: ~ cookies", context.req.cookies);
      const { token } = context.req.cookies;
      console.log("🚀 ~ file: AuthResolver.ts ~ line 36 ~ currentUser: ~ token", token);
      if (!token) return {};
      let userId;
      let user;
      try {
        userId = jwt.verify(token, SECRET).userId;
        user = await context.prisma.user.findUnique({ where: { id: userId } });
        console.log("🚀 ~ file: AuthResolver.ts ~ line 47 ~ currentUser: ~ userId", userId);
      } catch (err) {
        console.log("there is no user");
        throw new AuthenticationError("Authentication token has expired, please log in again");
      } finally {
        console.log("Finally here");
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
      setAuthCookies(context.res, { token, userId: user.id, firstName: user.firstName });
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
      else {
        const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: JWT_EXP_THRESHOLD });
        setAuthCookies(context.res, { token, userId: user.id, firstName: user.firstName });
        context.userId = user.id;
        return user;
      }
    },
    logOut: async (parent, args, context, info) => {
      clearAuthCookies(context.res);
    }
  }
};
