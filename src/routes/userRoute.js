const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const jobController = require("../controllers/jobController");

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.use(authController.protect);

router.route("/jobs").get(authController.protect, jobController.getAllJobs);
router.patch("/offers/:jobId/accept", userController.acceptJobOffer);

router
  .route("/")
  .get(userController.getAllUser)
  .post(authController.protect, userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);



router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/updateMyPassword", authController.updatePassword);

module.exports = router;
