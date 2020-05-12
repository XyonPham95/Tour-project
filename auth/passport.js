const passport = require("passport");
const facebookStrategy = require("./facebook");
const googleStrategy = require("./google");
const githubStrategy = require("./github");

passport.use(facebookStrategy);
passport.use(googleStrategy);
passport.use(githubStrategy);

module.exports = passport;
