const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Job name is required"],
  },
  title: {
    type: String,
    required: [true, "Job name is required"],
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    // required: true,
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
  },
  type: {
    type: String,
    required: [true, "the job type is required"],
    enum: ["partTime", "fullTime", "internship", "training"],
  },
  location: {
    type: String,
    // default: req
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
  appliedByUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  savedByUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  statistics: {
    view: {
      type: Number,
      default: 0,
    },
    apply: {
      type: Number,
      default: 0,
    },
    save: {
      type: Number,
      default: 0,
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
