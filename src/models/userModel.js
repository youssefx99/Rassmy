const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please inseart name"],
  },
  role: {
    type: String,
    enum: ["user", "employee", "admin"],
    default: "user",
  },
  email: {
    type: String,
    requried: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter a valid mail"],
  },
  password: {
    type: String,
    requried: [true, "password is require"],
  },
  passwordConfim: {
    type: String,
    requried: [true, "password is require"],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "passwords are not the same",
    },
  },
  address: {
    type: String,
  },
  company: {
    type: String,
    lowercase: true,
  },
  job: {
    type: String,
  },
  field: {
    type: String,
  },
  CV: {
    type: Buffer,
    contentType: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
