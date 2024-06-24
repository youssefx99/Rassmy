const mongoose = require("mongoose");
const validator = require("validator");

const companySchema = new mongoose.Schema({
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
  size:{
    type: Number,
    default: 0
  },
  field:{
    type: String,
    require:[true, "comapny filed is a must"]
  }, 

  // add dataType of employees
});

const Company = mongoose.model(companySchema, "Company");
module.exports = Company;
