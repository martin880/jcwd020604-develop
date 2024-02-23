const express = require("express");
const router = express.Router();
const ordersController = require("../controllers").ordersController;
const checkRole = require("../middlewares/roleDecoder");

router.get("/orders", checkRole.checkWAdmin, ordersController.getAllOrder);
router.get("/orders/:id", checkRole.checkWAdmin, ordersController.getOrderById);
router.get("/order-details/:id", checkRole.checkWAdmin, ordersController.getOrderDetailById);
router.patch("/orders/:id", checkRole.checkAdmin,ordersController.updateOrder);
router.delete("/orders/:id", checkRole.checkAdmin,ordersController.deleteOrder);

module.exports = router;
