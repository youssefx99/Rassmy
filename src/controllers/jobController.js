const Job = require("../models/jobModel");
const Company = require("../models/companyModel");
const User = require("../models/userModel");
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
  const { jobCategory } = req.query;

  if (!jobCategory) {
    return next(new AppError(400, "Please specify the job category"));
  }

  let jobs = [];

  if (jobCategory === "applied") {
    jobs = req.model.applyedJobs || [];
  } else if (jobCategory === "saved") {
    jobs = req.model.savedJobs || [];
  } else {
    return next(new AppError(400, "Invalid job category"));
  }

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
    data: job,
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
// ################################################################

exports.createCompanyJob = catchAsync(async (req, res, next) => {
  console.log(req.model);
  const job = await Job.create(req.body);

  console.log(req.model.jobs);
  await Company.updateOne({ _id: req.model._id }, { $push: { jobs: job._id } });

  return res.status(201).json({
    status: "success",
    data: job,
  });
});

exports.getCompanyJobs = catchAsync(async (req, res, next) => {
  const companyID = req.model._id;
  const company = await Company.findById(companyID).populate("jobs");

  if (!company) {
    return next(new AppError(404, "No Compant found"));
  }

  if (company.jobs.length === 0) {
    return next(new AppError(404, "Company has no jobs"));
  }

  return res.status(200).json({
    status: "success",
    length: company.jobs.length,
    data: company.jobs,
  });
});

exports.saveJob = catchAsync(async (req, res, next) => {
  const jobId = req.params.id;
  const userId = req.model._id;
  const job = await Job.findById(jobId);

  if (job.savedByUsers.includes(userId)) {
    return next(new AppError(400, "You have already saved this job"));
  }

  await Job.updateOne({ _id: jobId }, { $push: { savedByUsers: userId } });

  await User.updateOne({ _id: userId }, { $push: { savedJobs: jobId } });

  // if apply before error

  return res.status(200).json({
    status: "success",
    message: "You saved on the job successfully",
  });
});

exports.applyOnJob = catchAsync(async (req, res, next) => {
  const jobId = req.params.id;
  const userId = req.model._id;
  const job = await Job.findById(jobId);

  if (job.appliedByUsers.includes(userId)) {
    return next(new AppError(400, "You have already applied for this job"));
  }

  await Job.updateOne({ _id: jobId }, { $push: { appliedByUsers: userId } });

  await User.updateOne({ _id: userId }, { $push: { applyedJobs: jobId } });

  // if apply before error

  return res.status(200).json({
    status: "success",
    message: "You Apply on the job successfully",
  });
});

exports.shareJob = catchAsync(async (req, res, next) => {
  const jobId = req.params.id;
  const { email } = req.body; // Assuming email is provided in the request body

  // Find user by email
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError(404, "User not found"));
  }

  // Check if the job is already shared with the user
  if (user.sharedJobs && user.sharedJobs.includes(jobId)) {
    return next(new AppError(400, "Job is already shared with this user"));
  }

  // Update user's sharedJobs
  await User.updateOne({ _id: user._id }, { $push: { sharedJobs: jobId } });

  return res.status(200).json({
    status: "success",
    message: "Job shared successfully with user",
  });
});

exports.getApplicationStatus = catchAsync(async (req, res, next) => {});
