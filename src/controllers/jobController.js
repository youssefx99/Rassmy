const Job = require("../models/jobModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getJob = catchAsync(async (req, res, next) => {
  const job = await Job.findOne(req.body.id);

  return res.status(200).json({
    status: "success",
    data: job,
  });
});

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find({});

  return res.status(200).json({
    status: "success",
    size: jobs.length,
    data: jobs,
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const job = await Job.create(req.body);

  return res.status(201).json({
    status: "success",
    data: job,
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!job) return next(new AppError(404, "No job found with that ID"));

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id);

  if (!job) return next(new AppError(404, "No job found with that ID"));

  return res.status(200).json({
    status: "success",
    data: null,
  });
});
