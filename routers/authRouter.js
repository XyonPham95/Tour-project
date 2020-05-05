const router = require("express").Router();
const { login, auth, logout } = require("../controllers/authController");

router.route("/login").post(login);

router.route("/logout").post(auth, logout);

module.exports = router;
