const express = require("express");
const mongoose = require("mongoose");
const app = express();

const jobRouter = require("./src/routes/jobRoute");

app.use("/jobs", jobRouter);

module.exports = app;
