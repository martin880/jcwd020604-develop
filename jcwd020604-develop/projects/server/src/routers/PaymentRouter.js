const express = require("express");
const router = express.Router();
const handlePaymentController = require("../controllers").handlePaymentController;
const checkRole = require("../middlewares/roleDecoder");

router.patch("/payment/confirm-payment/:id", checkRole.checkWAdmin, handlePaymentController.adminConfirmOrderPayment);

module.exports = router;