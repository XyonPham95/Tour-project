const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User's name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "User's email is required"],
    trim: true,
    unique: true,
    validate: {
      validator(v) {
        if (!validator.isEmail(v)) throw new Error("Invalid email");
      },
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
  },
  tokens: Array,
});

userSchema.pre("findOneAndUpdate", async function (next) {
  if (!this._update.password) return next();
  this._update.password = await bcrypt.hash(this._update.password, saltRounds);
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("No user found");
  const match = await bcrypt.compare(password.toString(), user.password);
  if (!match) throw new Error("No user found");
  return user;
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

userSchema.methods.generateToken = async function () {
  const token = await jwt.sign({ id: this._id }, process.env.SECRET, {
    expiresIn: "7d",
  });
  if (this.tokens.length > 4) {
    this.tokens.shift();
  }
  this.tokens.push(token);
  await this.save();
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
