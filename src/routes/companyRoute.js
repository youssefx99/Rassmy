const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const jobRouter = require("../routes/jobRoute");

router.use(authController.protect);

router.use("/jobs", jobRouter);

router
  .route("/")
  .get(companyController.getAllCompany)
  .post(companyController.createCompany);

router
  .route("/:id")
  .get(companyController.getCompany)
  .patch(companyController.updateCompany)
  .delete(companyController.deleteCompany);

router.post("/:id/contact", userController.contactCompany);

router.get("/:jobId/applications", companyController.getJobAppliactions);
router.get("/:jobId/accept", companyController.acceptApplication);

router
  .route("/:companyName/employees")
  .get(companyController.getCompanyEmployee)
  .patch(companyController.adjustEmployee);

router.patch("/:jobId/offer", companyController.offerJobToUser);

module.exports = router;
