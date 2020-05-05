const Tour = require("../models/tour");
const Review = require("../models/review");
const AppError = require("../middlewares/appError");
const { deleteOne, updateOne, readAll } = require("./factories");
const catchAsync = require("../middlewares/catchAsync");

exports.createTour = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const tour = new Tour({
      ...req.body,
      organizer: req.user._id,
    });
    await tour.save();
    return res.status(201).json({
      status: "ok",
      data: tour,
    });
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.readFilterTours = catchAsync(async (req, res, next) => {
  const filters = { ...req.query };
  const paginationKeys = ["limit", "page", "sort"];
  paginationKeys.map((el) => delete filters[el]);

  const filterTours = Tour.find(filters);
  const countTours = await Tour.find(filters).countDocuments();

  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(" ");
    filterTours.sort(sortBy);
  } else if (!req.query.sort) {
    filterTours.sort("-createdAt");
  }

  if (req.query.page || req.query.limit) {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 2;
    const skip = (page - 1) * limit;
    filterTours.skip(skip).limit(limit);

    if (req.query.page && skip > countTours) {
      return next(new AppError(400, "Page number out of range"));
    }
  }

  const sortedResult = await filterTours;

  res.json({
    status: "ok",
    data: sortedResult,
  });
});

exports.readSingleTour = async (req, res) => {
  try {
    const singleTour = await Tour.findById(req.params.tourID).populate(
      "reviews",
      "_id content rating user"
    );
    return res.status(200).json({
      status: "ok",
      data: singleTour,
    });
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.readMyTours = async (req, res) => {
  try {
    const myTours = await Tour.find({ organizer: req.user });
    return res.status(200).json({
      status: "ok",
      data: myTours,
    });
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.readToursOfCategory = async (req, res) => {
  try {
    const tours = await Tour.find({
      categories: { $in: req.params.categoryID },
    });
    console.log("tours", tours);
    if (!tours) throw new Error("No tour of this category");
    return res.status(200).json({
      status: "ok",
      data: tours,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateTour = updateOne(Tour);

exports.deleteTour = deleteOne(Tour);

exports.readAllTours = readAll(Tour);
