const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoute");
router.use("/user", userRoutes);
const companyRoutes = require("./companyRoute");
const jobRoutes = require("./jobRoute");
const authController = require("../controllers/authController");
// const cvRoute = require("./cvRoute");

// router.use("/", cvRoute);

router.use(authController.protect);
router.use("/company", companyRoutes);
router.use("/jobs", jobRoutes);

module.exports = router;
