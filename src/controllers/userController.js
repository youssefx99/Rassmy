const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  return res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new AppError(404, "No user found with that ID"));

  return res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return next(new AppError(404, "No user found with that ID"));

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne(req.body.id);

  return res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find({});

  return res.status(200).json({
    status: "success",
    size: user.length,
    data: user,
  });
});
