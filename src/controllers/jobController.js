const Job = require("../models/jobModel");
const Company = require("../models/companyModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const Application = require("../models/applicationModel");
const AppError = require("../utils/appError");
const { compare } = require("bcryptjs");

exports.getJob = catchAsync(async (req, res, next) => {
  const job = await Job.findOne(req.body.id);

  job.view++;

  return res.status(200).json({
    status: "success",
    data: job,
  });
});

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const queryParams = req.query;

  const queryObj = {};
  for (const [key, value] of Object.entries(queryParams)) {
    if (value) {
      queryObj[key] = value;
    }
  }

  // TODO = add more filtering options

  const jobs = await Job.find(queryObj)
    .populate({
      path: "company",
      select: "name",
    })
    .exec();

  const theJobs = jobs.map((job) => ({
    name: job.name,
    company: job.company,
    description: job.description,
    skills: job.skills,
    fields: job.fields,
    price: job.price,
    _id: job._id,
  }));

  res.status(200).json({
    status: "success",
    length: jobs.length,
    data: theJobs,
  });
});

exports.getUserJobs = catchAsync(async (req, res, next) => {
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

exports.getJob = catchAsync(async (req, res, next) => {
  const jobId = req.params.id;

  // Find the job and populate necessary fields
  const job = await Job.findById(jobId)
    .populate({
      path: "company",
      select: "name",
    })
    .exec();

  if (!job) {
    return next(new AppError(404, "Job not found"));
  }

  // Find applications related to this job
  const applications = await Application.find({ job: jobId }).populate(
    "user",
    "name"
  );

  // Construct response object
  const jobWithApplications = {
    _id: job._id,
    name: job.name,
    company: job.company,
    description: job.description,
    skills: job.skills,
    fields: job.fields,
    price: job.price,
    applications: applications.map((app) => ({
      user: app.user,
      status: app.status,
      applicationDate: app.applicationDate,
    })),
  };

  res.status(200).json({
    status: "success",
    data: jobWithApplications,
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
  req.body.company = req.model._id;
  const job = await Job.create(req.body);
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
    return next(new AppError(404, "No Company found"));
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

  job.save++;

  return res.status(200).json({
    status: "success",
    message: "You saved on the job successfully",
  });
});

exports.applyOnJob = catchAsync(async (req, res, next) => {
  const jobId = req.params.id;
  const userId = req.model._id;
  const job = await Job.findById(jobId);

  if (!job) {
    return next(new AppError(404, "Job not found"));
  }

  if (job.appliedByUsers.includes(userId)) {
    return next(new AppError(400, "You have already applied for this job"));
  }

  // Create a new Application record with initial status "applied"
  const application = await Application.create({
    user: userId,
    job: jobId,
    status: "applied",
  });

  // Update job's appliedByUsers and statistics.apply
  await Job.findByIdAndUpdate(jobId, {
    $push: { appliedByUsers: userId },
    $inc: { "statistics.apply": 1 },
  });

  // Update user's applyedJobs
  await User.findByIdAndUpdate(userId, { $push: { applyedJobs: jobId } });

  // Create a notification for the user
  const userNotificationMessage = `You applied for the job "${job.name}"`;
  await Notification.create({ user: userId, message: userNotificationMessage });

  // Find the company associated with the job
  const company = await Company.findById(job.company);

  if (!company) {
    return next(new AppError(404, "Company not found"));
  }

  // Create a notification for the company
  const companyNotificationMessage = `A user applied for your job "${job.name}"`;
  await Notification.create({
    user: company._id,
    message: companyNotificationMessage,
  });

  return res.status(200).json({
    status: "success",
    message: "You applied for the job successfully",
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

  // Notafication
  const message = `${user.name} has shared a job with you`;

  await Notification.create({
    user: user._id,
    message,
  });

  return res.status(200).json({
    status: "success",
    message: "Job shared successfully with user",
  });
});

exports.getApplicationStatus = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const userId = req.model._id;

  // Find the application for the given job and user
  const application = await Application.findOne({ job: jobId, user: userId });

  if (!application) {
    return new AppError(404, "No application found for this job");
  }

  return res.status(200).json({
    status: "success",
    data: { status: application.status },
  });
});
