const express = require("express");
const path = require("path");
// const favicon = require('serve-favicon')

const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passportConfig = require("./config/passport");
const expressLayouts = require("express-ejs-layouts");

const index = require("./routes/index");
const auth = require("./routes/auth");
const profile = require("./routes/profile");
const recipes = require("./routes/recipes");
const api = require("./routes/api");
const events = require("./routes/events");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = passportConfig();

const aws = require("aws-sdk");

const app = express();

require("dotenv").config();

// mongoose configuration
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout", "layouts/main-layout");
app.use(expressLayouts);

// Static
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "bower_components/")));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Amazon S3 config
aws.config.region = "eu-central-1";
aws.Credentials.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
aws.Credentials.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// session and passport
app.use(session({
  secret: "carrito-fajitas",
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 365 * 24 * 60 * 60 * 1000 // 1 year
  }),
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  // Use the first part of the url to get the current nav
  res.locals.navScope = req.originalUrl.split("/")[1];
  // Get the current section of the nav.Use the second part of the url if it 's shorter than the 
  // number of characters of an ObjectID in mongo(24), otherwise use the third part of the url
  if (req.originalUrl.split("/")[2]) {
    res.locals.sectionScope = req.originalUrl.split("/")[2].length < 24 ?
      req.originalUrl.split("/")[2] : req.originalUrl.split("/")[3];

  } else {
    res.locals.sectionScope = "/";
  }
  next();
});

// Insert into locals if there is a logged in user or not
app.use((req, res, next) => {
  if (typeof (req.user) !== "undefined") {
    res.locals.userSignedIn = true;
  } else {
    res.locals.userSignedIn = false;
  }
  next();
});

// Routes
app.use("/", auth);
app.use("/", index);
app.use("/profile", profile);
app.use("/recipes", recipes);
app.use("/api", api);
app.use("/events", events);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;