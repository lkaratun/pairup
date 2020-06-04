require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const activitiesRouter = require("./routes/activities");
require("./middleware/localAuth");
const authRouter = require("./routes/auth");
const eventsRouter = require("./routes/events");
const locationsRouter = require("./routes/locations");
const usersRouter = require("./routes/users");
const fs = require("fs");
const spdy = require("spdy");
const config = require("../config.json");

const { FRONTEND_URL } = config[process.env.NODE_ENV];

const httpPort = process.env.PORT || 8000;
const httpsPort = process.env.HTTPS_PORT || 8443;
const app = express();

app.use(helmet());
app.use(cors({ credentials: true, origin: FRONTEND_URL }));
app.use(logger("combined"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/users", passport.authenticate("userRequired"), usersRouter);
app.use("/activities", activitiesRouter);
app.use("/locations", locationsRouter);
app.use("/events", eventsRouter);
app.use((err, req, res, next) =>
  res.headersSent ? next(err) : res.status(500).json({ message: err.message })
);

app.use(compression());

const { SSL_CERT_PATH, SSL_KEY_PATH } = process.env;

spdy
  .createServer(
    {
      key: fs.readFileSync(path.resolve(SSL_KEY_PATH)),
      cert: fs.readFileSync(path.resolve(SSL_CERT_PATH)),
      protocols: ["h2", "spdy/3.1", "spdy/3", "spdy/2", "http/1.1", "http/1.0"]
    },
    app
  )
  .listen(httpsPort, () =>
    console.log(`Server is listening to https requests on port ${httpsPort}!`)
  );
app.listen(httpPort, () =>
  console.log(`Listening on http requests on port ${httpPort}!`)
);
