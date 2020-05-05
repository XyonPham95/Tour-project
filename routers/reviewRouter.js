const router = require("express").Router({ mergeParams: true });
const { auth } = require("../controllers/authController");
const { checkTourExist } = require("../middlewares/checkTour");

const {
  createReview,
  readReviews,
  readAllReviews,
  checkReview,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController");

router
  .route("/:reviewID")
  .delete(auth, checkTourExist, checkReview, deleteReview)
  .patch(auth, checkTourExist, checkReview, updateReview);

router
  .route("/")
  .post(auth, checkTourExist, createReview)
  .get(checkTourExist, readReviews)
  .get(checkTourExist, readAllReviews);

module.exports = router;
