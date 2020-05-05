const mongoose = require("mongoose");
const AppError = require("../middlewares/appError");

const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please type some review"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please login"],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.statics.calculateAvgRating = async function (tourID) {
  console.log("tourID", tourID);
  const stats = await this.aggregate([
    {
      $match: { tour: tourID },
    },
    {
      $group: {
        _id: "$tour",
        ratingQuantity: { $sum: 1 },
        ratingAverage: { $avg: "$rating" },
      },
    },
  ]);

  await mongoose.model("Tour").findByIdAndUpdate(tourID, {
    ratingQuantity: stats.length === 0 ? 0 : stats[0].ratingQuantity,
    ratingAverage: stats.length === 0 ? 0 : stats[0].ratingAverage,
  });
};

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.doc = await this.findOne();
  if (!this.doc) return next(new AppError(404, "Review not found"));
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.doc.constructor.calculateAvgRating(this.doc.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
