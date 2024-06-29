const Company = require("../models/companyModel");
const User = require("../models/userModel");
const Job = require("../models/jobModel");
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

  // Call the correct function name with `res` as the first argument
  returnRequest(res, 200, "success", updatedUser);
});

exports.getJobAppliactions = catchAsync(async (req, res, next) => {
  const jobId = req.params.jobId;
  const company = req.model;

  if (!company.jobs.includes(jobId))
    return next(new AppError(404, "Company hasn't this Job ID"));

  // Fetch the job by its ID and populate the 'appliedByUsers' field
  const job = await Job.findById(jobId).populate("appliedByUsers");

  if (!job) {
    return returnRequest(res, 404, "error", "Job not found");
  }

  const applications = job.appliedByUsers.map((user) => ({
    userName: user.name,
    email: user.email,
    address: user.address,
    company: user.company,
    job: user.job,
    fidld: user.field,
    CV: user.CV,
  }));

  return returnRequest(res, 200, "success", {
    length: applications.length,
    applications,
  });
});

exports.acceptApplication = catchAsync(async (req, res, next) => {
  const company = req.model;
  const user = await User.findOne({ email: req.body.email });
  const job = await Job.findById(req.params.jobId);

  if (!user) {
    return next(new AppError(404, "The usre is not an canditate for this job"));
  }

  if (!job) {
    return next(new AppError(404, "Job not found"));
  }

  user.job = job.title;
  user.company = company.name;
  user.role = "employee";
  user.field = [...new Set([...user.field, ...job.fields])];

  company.size++;

  await user.save();
  await company.save({ validateBeforeSave: false });

  return res.status(200).json({
    status: "success",
    message: "The user has been successfully accepted for the job.",
  });
});

exports.getCompanyJobs = catchAsync(async (req, res, next) => {});
