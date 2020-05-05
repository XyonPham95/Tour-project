const AppError = require("./appError");

const catchAsync = (func) => (req, res, next) => {
  return func(req, res, next).catch((err) =>
    next(new AppError(err.statusCode, err.message))
  );
};

module.exports = catchAsync;
