const express = require("express");
const companyRoutes = require("./companyRoute");
const jobRoutes = require("./jobRoute");
const userRoutes = require("./userRoute");
const authController = require("../controllers/authController");
// const cvRoute = require("./cvRoute");

const router = express.Router();
// router.use("/", cvRoute);

router.use("/user", userRoutes);
router.use(authController.protect);
router.use("/company", companyRoutes);
router.use("/jobs", jobRoutes);

module.exports = router;
