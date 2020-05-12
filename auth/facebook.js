const strategy = require("passport-facebook");
const FacebookStrategy = strategy.Strategy;
const User = require("../models/user");

module.exports = new FacebookStrategy(
  {
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.DOMAIN + process.env.FB_CB,
    profileFields: ["id", "email", "name", "photos"],
  },
  async function (accessToken, refreshToken, profile, cb) {
    console.log(profile);
    const { name, email } = profile._json;
    const user = await User.findOneOrCreate({ name, email });
    cb(null, user);
  }
);
