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
const recipe = require("./routes/recipe");
const api = require("./routes/api");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = passportConfig();

const app = express();

// mongoose configuration
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/carrito-fajitas");

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

// Use the first part of the url to manage the menu partial
app.use((req, res, next) => {
  res.locals.navScope = req.originalUrl.split("/")[1];
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
app.use("/recipe", recipe);
app.use("/api", api);

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