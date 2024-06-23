const mongoose = require("mongoose");

const productSchma = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "priduct name is requried"],
  },
  mark: {
    type: String,
    require: [true, "product mark is requried"],
  },
  price: {
    type: Number,
    requrie: [true, "product price is requried"],
  },
  partability: Boolean,
});

const Product = mongoose.model(productSchma, "Product");

model.exports = Product;
