const Company = require("../models/companyModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createCompany = catchAsync(async (req, res, next) => {
  const company = await Company.create(req.body);

  return res.status(201).json({
    status: "success",
    data: company,
  });
});

exports.updateCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!company) return next(new AppError(404, "No company found with that ID"));

  return res.status(200).json({
    status: "success",
    data: company,
  });
});

exports.deleteCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findByIdAndDelete(req.params.id);

  if (!company) return next(new AppError(404, "No company found with that ID"));

  return res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findOne(req.body.id);

  return res.status(200).json({
    status: "success",
    data: company,
  });
});

exports.getAllCompany = catchAsync(async (req, res, next) => {
  const company = await Company.find({});

  return res.status(200).json({
    status: "success",
    size: company.length,
    data: company,
  });
});

exports.getCompanyEmployee = catchAsync(async (req, res, next) => {
  const companyStr = req.params.companyName.toLowerCase();

  console.log(`Company Name is ${companyStr}`);
  if (!companyStr)
    return next(new AppError(404, "please enter the company name"));
  const users = await User.find({ company: companyStr });

  if (!users || users.length === 0)
    return next(new AppError(404, "company has no stuff"));

  return res.status(200).json({
    status: "success",
    size: users.length,
    data: users,
  });
});

exports.adjustEmployee = catchAsync(async (req, res, next) => {});
