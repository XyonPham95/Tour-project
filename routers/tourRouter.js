const router = require("express").Router();

const {
  createTour,
  readAllTours,
  readSingleTour,
  readMyTours,
  readFilterTours,
  deleteTour,
  updateTour,
} = require("../controllers/tourController");
const { checkTour } = require("../middlewares/checkTour");

const { auth } = require("../controllers/authController");

router.route("/myTours").get(auth, readMyTours);

router.route("/all").get(readAllTours);

router
  .route("/:tourID")
  .delete(auth, checkTour, deleteTour)
  .patch(auth, checkTour, updateTour)
  .get(auth, checkTour, readSingleTour);

router.route("/").get(readFilterTours);

router.route("/newTour").post(auth, createTour);

module.exports = router;
