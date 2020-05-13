const User = require("../models/user");
const jwt = require("jsonwebtoken");
const catchAsync = require("../middlewares/catchAsync");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    const token = await user.generateToken();

    return res.status(200).json({
      status: "ok",
      data: user,
      token: token,
    });
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.auth = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    throw new Error("Unauthorized access");
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  const decoded = await jwt.verify(token, process.env.SECRET);

  const user = await User.findById(decoded.id);
  req.user = user;

  next();
});

exports.logout = catchAsync(async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  req.user.tokens = req.user.tokens.filter((el) => el !== token);
  await req.user.save();
  res.status(204).json({ status: "success", data: null });
});

exports.logoutAll = catchAsync(async (req, res) => {
  req.user.tokens = [];
  await req.user.save();
  res.status(204).json({ status: "success", data: null });
});
