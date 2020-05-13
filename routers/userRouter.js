const router = require("express").Router();
const {
  createUser,
  readUsers,
  updateUser,
} = require("../controllers/userController");
const { auth } = require("../controllers/authController");

router.route("/").post(createUser).get(readUsers);

router
  .route("/me")
  .patch(auth, updateUser)
  .get(auth, (req, res) => {
    res.json({ status: "ok", data: req.user });
  });

module.exports = router;
