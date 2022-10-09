var createError = require("http-errors");
var express = require("express");
const expressLayouts = require("express-ejs-layouts");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const flash = require("connect-flash");

var userRoute = require("./app/routes/index");
var adminRoute = require("./app/routes/moduleMaster/index");
var pegawaiRoute = require("./app/routes/modulePegawai/index");
var apiRoute = require("./app/routes/apiModulePegawai/index");

var app = express();

// Set Templating Engine
app.use(expressLayouts);
app.set("layout", "./layouts/full-width");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout extractScripts", true);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use(
  "/bower_components",
  express.static(path.join(__dirname, "bower_components"))
);
app.use(
  session({
    secret: "code-satu-kantor",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/pegawai", pegawaiRoute);

app.use("/api", apiRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
  console.log("check error ", err);
});

module.exports = app;
