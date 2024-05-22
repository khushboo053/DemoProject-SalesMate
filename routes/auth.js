const express = require("express");
const authController = require("../controllers/auth");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/verifyEmail", authController.getVerifyEmail);
router.post("/verifyEmail", auth, authController.postVerifyEmail);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", auth, authController.logout);

module.exports = router;
