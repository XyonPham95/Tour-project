const Review = require("../models/review");
const { deleteOne, updateOne, readAll } = require("./factories");
const catchAsync = require("../middlewares/catchAsync");

exports.createReview = catchAsync(async (req, res) => {
  const review = new Review({
    ...req.body,
    user: req.user._id,
    tour: req.params.tourID,
  });

  await review.save();
  return res.status(201).json({
    status: "ok",
    data: review,
  });
});

exports.readReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tour: req.params.tourID });
    return res.status(200).json({
      status: "ok",
      data: reviews,
    });
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.checkReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      user: req.user._id,
      tour: req.params.tourID,
      _id: req.params.reviewID,
    });
    if (!review) throw new Error("Review not found");
    if (req.user._id.toString() !== review.user._id.toString())
      throw new Error("You can only modify your reviews");
    next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.readAllReviews = readAll(Review);

exports.deleteReview = deleteOne(Review);

exports.updateReview = updateOne(Review);
