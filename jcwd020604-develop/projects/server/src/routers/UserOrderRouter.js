const express = require("express");
const { findClosestWarehouse } = require("../middlewares/findWarehouse");
const router = express.Router();
const userOrdersController = require("../controllers").userOrdersController;
const { fileUploader } = require("../middlewares/multer");

router.get("/orders", userOrdersController.getAllOrder);
router.get("/orders/:user_id", userOrdersController.getOrderByUser);

router.get("/ordersUser/:id", userOrdersController.getOrderById);
router.get("/order-details/:id", userOrdersController.getOrderDetailById);

router.post(
  "/addOrder",
  findClosestWarehouse,
  userOrdersController.createOrderByUser
);
router.post("/order-detail", userOrdersController.createOrderDetail);
router.patch("/orders-done/:id", userOrdersController.userDone);
router.patch("/orders/:id", userOrdersController.updateOrder);
router.delete("/orders/:id", userOrdersController.deleteOrderByUser);
router.patch(
  "/payment/:order_id",
  fileUploader({ destinationFolder: "paymentProof" }).single("paymentProof"),
  userOrdersController.paymentProofByUser
);

module.exports = router;
