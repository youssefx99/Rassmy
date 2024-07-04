const jobModel = require("./src/models/jobModel");
const userModel = require("./src/models/userModel");
const companyModel = require("./src/models/companyModel");
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connection successful!"));

const deleteJobs = async () => {
  await jobModel.deleteMany({});
};

const deleteCompanies = async () => {
  await companyModel.deleteMany({});
};

const deleteUsers = async () => {
  await userModel.deleteMany({});
};

if (process.argv[2] === "jobs") {
  deleteJobs().then(() => {
    console.log("Jobs deleted successfully");
    process.exit(0);
  });
} else if (process.argv[2] === "users") {
  deleteUsers().then(() => {
    console.log("Users deleted successfully");
    process.exit(0);
  });
} else if (process.argv[2] === "company") {
  deleteCompanies().then(() => {
    console.log("Companies deleted successfully");
    process.exit(0);
  });
}
