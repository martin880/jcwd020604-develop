const express = require("express");
const router = express.Router();
const insertAddressController = require("../controllers").insertAddressController;

router.post("/", insertAddressController.insertAddress);
router.post("/users", insertAddressController.insertUsersAddress);

module.exports = router;