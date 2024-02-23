const express = require("express");
const router = express.Router();
const passwordController = require("../controllers").passwordController;
const authController = require("../controllers").authController;

router.post("/reset-password", passwordController.resetPassword);
router.patch(
	"/verify-password",
	authController.getByTokenV2,
	passwordController.verifyV2
);

module.exports = router;