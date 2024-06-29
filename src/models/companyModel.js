const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please inseart name"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter a valid mail"],
  },
  password: {
    type: String,
    required: [true, "password is require"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "password is require"],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "passwords are not the same",
    },
  },
  size: {
    type: Number,
    default: 0,
  },
  fields: {
    type: [String],
    required: [true, "comapny filed is a must"],
  },
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  // add dataType of employees
});

companySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

companySchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

companySchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

companySchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 100000;

  return resetToken;
};

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
