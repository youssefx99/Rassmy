const Company = require("../models/companyModel");
const User = require("../models/userModel");
const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");
const Notafication = require("../models/noticationModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const returnRequest = require("../utils/returnRequest");

exports.createCompany = catchAsync(async (req, res, next) => {
  const company = await Company.create(req.body);

  returnRequest(res, 201, "success", company);
});

exports.updateCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!company) return next(new AppError(404, "No company found with that ID"));

  returnRequest(res, 200, "success", company);
});

exports.deleteCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findByIdAndDelete(req.params.id);

  if (!company) return next(new AppError(404, "No company found with that ID"));

  returnRequest(res, 200, "success", null);
});

exports.getCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findOne(req.body.id);

  returnRequest(res, 200, "success", company);
});

exports.getAllCompany = catchAsync(async (req, res, next) => {
  const company = await Company.find({});

  returnRequest(res, 200, "success", {
    size: company.length,
    data: company,
  });
});

exports.getCompanyEmployee = catchAsync(async (req, res, next) => {
  const companyStr = req.params.companyName.toLowerCase();

  if (!companyStr)
    return next(new AppError(404, "please enter the company name"));
  const users = await User.find({ company: companyStr });

  if (!users || users.length === 0)
    return next(new AppError(404, "company has no stuff"));

  returnRequest(res, 200, "success", {
    size: users.length,
    data: users,
  });
});

exports.adjustEmployee = catchAsync(async (req, res, next) => {
  const { id, ...newData } = req.body;

  if (!id) {
    return next(new AppError(400, "User ID is required"));
  }

  const updatedUser = await User.findByIdAndUpdate(id, newData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError(404, "User not found"));
  }

  // notifacation
  const message = `${newData} has been updated by ${model.name} check your profile please check updates`;
  await Notafication.create({ user: id, message });

  // Call the correct function name with `res` as the first argument
  returnRequest(res, 200, "success", updatedUser);
});

exports.getJobApplications = catchAsync(async (req, res, next) => {
  const jobId = req.params.jobId;
  const company = req.model; // Assuming company is attached to req.model

  if (!company.jobs.includes(jobId)) {
    return next(new AppError(404, "Company doesn't have this Job ID"));
  }

  // Fetch the job by its ID and populate the 'appliedByUsers' field
  const job = await Job.findById(jobId).populate("appliedByUsers");

  if (!job) {
    return next(new AppError(404, "Job not found"));
  }

  // Retrieve applications for the job from the Application model
  const applications = await Application.find({ job: jobId }).populate("user");

  const formattedApplications = applications.map((application) => ({
    userName: application.user.name,
    email: application.user.email,
    address: application.user.address,
    company: application.user.company,
    job: application.user.job,
    field: application.user.field,
    CV: application.user.CV,
  }));

  return res.status(200).json({
    status: "success",
    length: formattedApplications.length,
    applications: formattedApplications,
  });
});

exports.acceptApplication = catchAsync(async (req, res, next) => {
  const company = req.model; // Assuming company is attached to req.model
  const user = await User.findOne({ email: req.body.email });
  const job = await Job.findById(req.params.jobId);

  if (!user) {
    return next(new AppError(404, "User not found"));
  }

  if (!job) {
    return next(new AppError(404, "Job not found"));
  }

  // Update user details
  user.job = job.title;
  user.company = company.name;
  user.role = "employee";
  user.field = [...new Set([...user.field, ...job.fields])];

  // Update company size
  company.size++;

  // Create notification for the user
  const userMessage = `You have been accepted for ${job.name} at ${company.name}`;
  await Notification.create({
    user: user._id,
    message: userMessage,
  });

  await user.save();
  await company.save({ validateBeforeSave: false });

  return res.status(200).json({
    status: "success",
    message: "The user has been successfully accepted for the job.",
  });
});

exports.offerJobToUser = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const { email } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(404, "User not found"));
  }

  // Find the job by ID
  const job = await Job.findById(jobId);
  if (!job) {
    return next(new AppError(404, "Job not found"));
  }

  // Offer the job to the user
  user.offeredJobs = user.offeredJobs || [];
  user.offeredJobs.push(job._id);

  // Create notification for the user
  const userMessage = `You have been offered the job ${job.name}`;
  await Notification.create({
    user: user._id,
    message: userMessage,
  });

  // Save the user
  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Job offered to user successfully",
  });
});

exports.getCompanyJobs = catchAsync(async (req, res, next) => {});
