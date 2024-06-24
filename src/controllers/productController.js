const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await product.findOne(req.body.id);

  return res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.createProduct = catchAsync((req, res, next) => {});

exports.updateProduct = catchAsync((req, res, next) => {});

exports.deleteProduct = catchAsync((req, res, next) => {});
