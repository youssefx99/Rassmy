const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Job name is requried"],
  },
  Company: {
    type: String,
    require: [true, "Job mark is requried"],
  },
  description: {
    type: String,
    requrie: [true, "Job description is requried"],
  },
  skills: {
    type: [String],
  },
  fields: {
    type: [String],
  },
  price: {
    type: Number,
  },
});

const Job = mongoose.model(jobSchema, "Job");

model.exports = Job;
