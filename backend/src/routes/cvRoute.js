const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/upload-cv",
  userController.uploadCV,
  userController.autoFillProfile
);

module.exports = router;
