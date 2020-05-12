const Tour = require("../models/tour");

exports.checkTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.tourID);
    if (!req.params.tourID || !tour) throw new Error("Tour doesn't exist");
    if (tour.organizer._id.toString() !== req.user._id.toString())
      throw new Error("You can only modify your own tours");
    req.tour = tour;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.checkTourExist = async (req, res, next) => {
  try {
    console.log("req.params", req.params);
    console.log("!req.params.tourID", !req.params.tourID);
    console.log(
      '!await Tour.exists({"_id": req.params.tourID})',
      !(await Tour.exists({ _id: req.params.tourID }))
    );
    if (!req.params.tourID || !(await Tour.exists({ _id: req.params.tourID })))
      throw new Error("Tour not found");
    next();
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      message: err.message,
    });
  }
};
