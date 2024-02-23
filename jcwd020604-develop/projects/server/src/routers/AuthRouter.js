const express = require("express");
const router = express.Router();
const authController = require("../controllers").authController;

// register new account
router.post("/register", authController.register);

// Email verification
router.patch("/verify", authController.verify);
router.post("/login", authController.login);
router.get("/v2", authController.getByTokenV2, authController.getUserByToken);

module.exports = router;
