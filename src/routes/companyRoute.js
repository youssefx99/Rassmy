const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");

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

module.exports = router;
