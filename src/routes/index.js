const express = require("express");
const companyRoutes = require("./companyRoute");
const jobRoutes = require("./jobRoute");
const userRoutes = require("./userRoute");

const router = express.Router();

router.use("/company", companyRoutes);
router.use("/jobs", jobRoutes);
router.use("/user", userRoutes);

module.exports = router;
