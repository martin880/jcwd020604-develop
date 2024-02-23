const express = require("express");
const router = express.Router();
const { findClosestWarehouse } = require("../middlewares/findWarehouse");

const { cartControllers } = require("../controllers");

router.get("/:user_id", cartControllers.getCartByUser);
router.post("/addCart", cartControllers.addCartByUser);
router.patch("/update/:id", cartControllers.editCartQty);
router.delete("/delete", cartControllers.deleteCartItem);
router.post("/get/cost", findClosestWarehouse, cartControllers.getCost);

// router.delete("/carts/delete", cartControllers.deleteCartByUser);

module.exports = router;
