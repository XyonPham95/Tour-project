const User = require("../models/user");
const jwt = require("jsonwebtoken");

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

exports.auth = async (req, res, next) => {
  try {
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
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");

    req.user.tokens = req.user.tokens.filter((el) => el.toString() !== token);
    await req.user.save();

    return res.status(200).json({
      status: "ok",
      data: req.user,
    });
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};
