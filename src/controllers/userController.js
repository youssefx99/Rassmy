const User = require("../models/userModel");
const Job = require("../models/jobModel");
const AppError = require("../utils/appError");
const email = require("../utils/email");
const Company = require("../models/companyModel");
const catchAsync = require("../utils/catchAsync");
const sendRequest = require("../utils/returnRequest");
const { text } = require("express");

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
  const user = await User.findById(req.params.id);

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

exports.contactCompany = catchAsync(async (req, res, next) => {
  console.log(req.model);

  // Fetch the company by ID
  const company = await Company.findById(req.params.id);

  if (!company) {
    return next(new AppError("No company found with that ID", 404));
  }

  // Populate employees and filter for HR
  await company.populate({
    path: "employees",
    select: "title email",
  });

  const HREmployee = company.employees.find((person) => person.title === "HR");

  if (!HREmployee) {
    return next(new AppError("No HR found for the company", 404));
  }

  // Extract subject and message from request body
  const { subject, message } = req.body;

  // Send the email
  await email({
    email: "ahmed.aboalisaad@gmail.com",
    subject,
    message,
  });

  // Send response
  sendRequest(res, 200, "success", {
    message: "Email sent successfully to the company",
  });
});

exports.followCompany = catchAsync(async (req, res, next) => {
  const companyId = req.params.companyId;
  const userId = req.user._id;

  // Check if the company exists
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new AppError(404, "Company not found"));
  }

  // Check if the user is already following the company
  if (company.followers.includes(userId)) {
    return next(new AppError(400, "You are already following this company"));
  }

  // Add user to the company's followers
  await Company.findByIdAndUpdate(companyId, { $push: { followers: userId } });

  // Add company to the user's followedCompanies
  await User.findByIdAndUpdate(userId, {
    $push: { followedCompanies: companyId },
  });

  res.status(200).json({
    status: "success",
    message: "You are now following the company for job updates",
  });
});

// ##############################################################################################
// const upload = require("../utils/multerConfig");
// const parseCV = require("../utils/cvParser");

// exports.uploadCV = upload.single("cv");

// exports.autoFillProfile = catchAsync(async (req, res, next) => {
//   console.log(req.file);
//   if (!req.file) {
//     return next(new AppError(400, "Please upload a CV"));
//   }

//   const filePath = req.file.path;
//   const userId = req.user._id;

//   // Parse the CV
//   const info = await parseCV(filePath);

//   // Update user profile
//   const user = await User.findById(userId);
//   if (info.name) user.name = info.name;
//   if (info.email) user.email = info.email;
//   if (info.address) user.address = info.address;
//   user.CV = filePath;

//   await user.save();

//   res.status(200).json({
//     status: "success",
//     data: {
//       user,
//     },
//   });
// });
