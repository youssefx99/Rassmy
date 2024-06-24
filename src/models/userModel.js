const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "please inseart name"],
  },
  role: {
    type: String,
    enum: ["user", "employee", "admin"],
    default: "user",
  },
  email: {
    type: String,
    requrie: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter a valid mail"],
  },
  password: {
    type: string,
    requrie: [true, "password is require"],
  },
  passwordConfim: {
    type: string,
    requrie: [true, "password is require"],
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
  job: {
    type: String,
  },
  field: {
    type: String,
  },
  CV: {
    type: Buffer,
    contentType: String,
  },
});

const User = mongoose.model(userSchema, "User");
module.exports = User;
