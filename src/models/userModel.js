const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "please inseart name"],
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
});

const User = mongoose.model(userSchema, "User");
module.exports = User;
