const Job = require("../models/jobModel");
const Company = require("../models/companyModel");
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
  req.model.jobs.push(job._id);
  console.log(req.model.jobs);
  await Company.updateOne({ _id: req.model._id }, { $push: { jobs: job._id } });

  return res.status(201).json({
    status: "success",
    data: job,
  });
});

exports.getCompanyJobs = catchAsync(async (req, res, next) => {
  const compoanyID = req.params.companyId;
});

exports.saveJob = catchAsync(async (req, res, next) => {});
exports.shareJob = catchAsync(async (req, res, next) => {});
exports.applyOnJob = catchAsync(async (req, res, next) => {});
exports.getApplicationStatus = catchAsync(async (req, res, next) => {});
