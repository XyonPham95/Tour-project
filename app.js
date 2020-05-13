require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const cors = require("cors");

const passport = require("./auth/passport");
const userRouter = require("./routers/userRouter");
const authRouter = require("./routers/authRouter");
const tourRouter = require("./routers/tourRouter");
const reviewRouter = require("./routers/reviewRouter");

const { errorController } = require("./middlewares/errorController");
const AppError = require("./middlewares/appError");

mongoose
  .connect(process.env.DB_LOCAL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to database"));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);
app.use(passport.initialize());

router.use("/users", userRouter);

router.use("/tours/:tourID/reviews", reviewRouter);

router.use("/tours", tourRouter);

router.use("/auth", authRouter);

function notFound(req, res, next) {
  next(new AppError(404, "URL Not Found"));
}

router.route("*").all(notFound);

app.use(errorController);

module.exports = app;
