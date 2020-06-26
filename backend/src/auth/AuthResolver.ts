import { AuthenticationError } from "apollo-server-express";
import bcrypt from "bcrypt";
import addMonths from "date-fns/addMonths";
import config from "../../config.json";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const JWT_EXP_THRESHOLD = process.env.JWT_EXP_THRESHOLD || "60d";
if (!SECRET) throw new Error("JWT_SECRET env.var missing!");

const { FRONTEND_DOMAIN, FRONTEND_URL } = config[process.env.NODE_ENV];

export default {
  Query: {
    currentUser: async (parent, args, context, info) => {
      const { token } = context.req.cookies;
      const { userId } = jwt.verify(token, SECRET);
      const user = await context.prisma.user.findOne({ where: { id: userId } });
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
      context.res.cookie("token", token, {
        expires: addMonths(new Date(), 1),
        httpOnly: true
        // domain: FRONTEND_DOMAIN
      });

      return user;
    },
    logIn: async (parent, args, context, info) => {
      const { email, password } = args;
      const user = await context.prisma.user.findOne({ where: { email } });
      if (!user) throw new AuthenticationError("User with the given email was not found");
      const passwordIsCorrect = await bcrypt.compare(password, user.password);
      if (!passwordIsCorrect) throw new AuthenticationError("Password is incorrect");
      else {
        const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: JWT_EXP_THRESHOLD });
        context.res.cookie("token", token, {
          expires: addMonths(new Date(), 1),
          httpOnly: true,
          domain: FRONTEND_DOMAIN
        });

        return user;
      }
    }
  }
};
