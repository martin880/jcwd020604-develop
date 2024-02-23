const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers").warehouseController;
const getWarehouseController = require("../controllers").getWarehouseController;
const checkRole = require("../middlewares/roleDecoder");

router.get("/", getWarehouseController.getWarehouse);
router.get(
	"/:id",
	checkRole.checkWAdmin,
	getWarehouseController.getWarehouseById
);
router.get(
	"/getAll/province/",
	checkRole.checkAdmin,
	getWarehouseController.getAllProvince
);
router.get(
	"/getAll/city/",
	checkRole.checkAdmin,
	getWarehouseController.getAllCity
);

router.post("/", checkRole.checkAdmin, warehouseController.insertWarehouse);
router.patch("/:id", checkRole.checkAdmin, warehouseController.editWarehouse);
router.delete(
	"/:id",
	checkRole.checkAdmin,
	warehouseController.deleteWarehouse
);
router.post("/assign", warehouseController.assignAdminUserToWarehouse);

module.exports = router;
