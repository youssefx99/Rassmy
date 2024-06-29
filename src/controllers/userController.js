const User = require("../models/userModel");
const Job = require("../models/jobModel");
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

exports.acceptJobOffer = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const user = req.model;
  console.log(user);

  // Find the job in the user's offered jobs
  const jobIndex = user.offeredJobs.indexOf(jobId);
  if (jobIndex === -1) {
    return next(new AppError(404, "Job offer not found"));
  }

  // Find the job details
  const job = await Job.findById(jobId);
  if (!job) {
    return next(new AppError(404, "Job not found"));
  }

  // Update user details
  user.company = job.company;
  user.role = "employee";
  user.title = job.title;
  user.field = [...new Set([...user.field, ...job.fields])];

  // Remove the accepted job from offered jobs
  user.offeredJobs.splice(jobIndex, 1);

  // Save user
  await user.save();

  return res.status(200).json({
    status: "success",
    message: "You have successfully accepted the job offer.",
  });
});
