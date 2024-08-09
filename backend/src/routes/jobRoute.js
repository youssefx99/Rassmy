const express = require("express");
const router = express.Router({ mergeParams: true });
const jobController = require("../controllers/jobController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(jobController.getAllJobs)
  .post(jobController.createCompanyJob);

router
  .route("/:id")
  .get(jobController.getJob)
  .patch(jobController.updateJob)
  .delete(jobController.deleteJob);

router.patch("/:id/save", jobController.saveJob);
router.patch("/:id/share", jobController.shareJob);
router.post(
  "/:id/apply",
  //   authController.restrictTo(["user", "admin", "employee"]),
  jobController.applyOnJob
);
router.get("/:id/status", jobController.getApplicationStatus);

module.exports = router;
