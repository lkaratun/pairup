require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const activitiesRouter = require("./routes/activities");
require("./middleware/localAuth");
const authRouter = require("./routes/auth");
const eventsRouter = require("./routes/events");
const placesRouter = require("./routes/places");
const usersRouter = require("./routes/users");
const compression = require("compression");
const fs = require("fs");
const spdy = require("spdy");

const httpPort = process.env.PORT || 8000;
const httpsPort = process.env.HTTPS_PORT || 8443;
const app = express();

app.use(helmet());
app.use(cors({ credentials: true }));
app.use(logger("combined"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/users", passport.authenticate("jwt"), usersRouter);
app.use("/activities", activitiesRouter);
app.use("/places", placesRouter);
app.use("/events", eventsRouter);
app.use((err, req, res, next) =>
  res.headersSent ? next(err) : res.status(500).json({ message: err.message })
);

app.use(compression());

spdy
  .createServer(
    {
      key: fs.readFileSync("localhost.key"),
      cert: fs.readFileSync("localhost.crt"),
      protocols: ["h2", "spdy/3.1", "spdy/3", "spdy/2", "http/1.1", "http/1.0"],
    },
    app
  )
  .listen(httpsPort, () =>
    console.log(`Server is listening to https requests on port ${httpsPort}!`)
  );
app.listen(httpPort, () => console.log(`Listening on http requests on port ${httpPort}!`));
