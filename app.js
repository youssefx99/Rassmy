const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const jobRouter = require("./src/routes/jobRoute");
const companyRouter = require("./src/routes/companyRoute");
const userRouter = require("./src/routes/userRouter");

const errorHandler = require("./src/utils/errorHandler");

const app = express();
const port = process.env.PORT | 8080;

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connection successful!"));

app.use(express.json());
app.use("/jobs", jobRouter);
app.use("/company", companyRouter);
app.use("/user", userRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
