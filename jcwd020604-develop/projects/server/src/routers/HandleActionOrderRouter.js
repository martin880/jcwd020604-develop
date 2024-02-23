const express = require("express");
const router = express.Router();
const handleActionOrderController = require("../controllers").handleActionOrderController;
const checkRole = require("../middlewares/roleDecoder");

router.patch("/orders/sending-order/:id", checkRole.checkWAdmin, handleActionOrderController.adminSendOrder);
router.put("/orders/cancel-order/:id", checkRole.checkWAdmin, handleActionOrderController.adminCancelOrder);

module.exports = router;