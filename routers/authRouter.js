const router = require("express").Router();
const {
  login,
  auth,
  logout,
  logoutAll,
} = require("../controllers/authController");
const { loginFacebook, facebookAuth } = require("../auth/facebookHandler");
const { loginGoogle, googleAuth } = require("../auth/googleHandler");
const { loginGithub, githubAuth } = require("../auth/githubHandler");

router.get("/login", login);

router.get("/facbook", loginFacebook);

router.get("/facebook/authorized", facebookAuth);

router.get("/google", loginGoogle);

router.get("/google/authorized", googleAuth);

router.get("/github", loginGithub);

router.get("/github/authorized", githubAuth);

router.get("/logout", auth, logout);

router.get("/logout", auth, logoutAll);

module.exports = router;
