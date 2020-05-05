const Review = require("../models/review");

exports.checkReview = async (req, res, next) => {
  try {
    const review = await Review.find({
      user: req.user._id,
      tour: req.params.tourID,
      _id: req.params.reviewID,
    });
    if (!review) throw new Error("Review not found");
    if (req.user._id.toString() !== review.user)
      throw new Error("You can only modify your reviews");
    next();
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};
