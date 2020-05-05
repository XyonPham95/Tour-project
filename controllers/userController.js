const User = require("../models/user");
const validator = require("validator");
const { readAll, updateOne } = require("./factories");
const catchAsync = require("../middlewares/catchAsync");

exports.createUser = catchAsync(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();

    return res.status(201).json({
      status: "ok",
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

exports.readUsers = readAll(User);

exports.updateUser = updateOne(User);
