const express = require("express");
const router = express.Router();
const addressController = require("../controllers").addressController;
const checkRole = require("../middlewares/roleDecoder");

router.get("/getAll/province/", addressController.getAllProvince);
router.get("/getAll/city/", addressController.getAllCity);
router.get("/users/:id", addressController.getAddressByUserId);
router.get("/:id", addressController.getAddressById);

router.patch("/:id", checkRole.checkUser, addressController.editAddress);
router.delete("/:id", checkRole.checkUser, addressController.deleteAddress);

module.exports = router;