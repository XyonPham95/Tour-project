const passport = require("passport");

exports.loginFacebook = passport.authenticate("facebook");

exports.facebookAuth = function (req, res, next) {
  passport.authenticate("facebook", function (err, user) {
    // if any error during the process, redirect user back to front end login page
    if (err) return res.redirect("https://localhost:3000/login");
    // if authentication succeeds, redirect user to successful front end page with a token
    res.redirect(
      `https://localhost:3000/?token=${user.tokens[user.tokens.length - 1]}`
    );
  })(req, res, next);
};
