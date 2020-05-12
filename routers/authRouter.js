const router = require("express").Router();
const { login, auth, logout } = require("../controllers/authController");
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

router.post("/logout", auth, logout);

module.exports = router;
