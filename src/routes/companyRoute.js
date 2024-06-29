const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");
const jobRouter = require("../routes/jobRoute");



router
  .route("/")
  .get(companyController.getAllCompany)
  .post(companyController.createCompany);

router
  .route("/:id")
  .get(companyController.getCompany)
  .patch(companyController.updateCompany)
  .delete(companyController.deleteCompany);

router
  .route("/:companyName/employees")
  .get(companyController.getCompanyEmployee)
  .patch(companyController.adjustEmployee);

router.use("/:companyId/jobs", jobRouter);

module.exports = router;
