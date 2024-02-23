const express = require("express");
const router = express.Router();
const productController = require("../controllers").productController;
const getProductController = require("../controllers").getProductController;
const { fileUploader } = require("../middlewares/multer");
const checkRole = require("../middlewares/roleDecoder");

router.get("/", checkRole.checkUser, getProductController.getAll);
router.get(
	"/getAllProduct/getAll",
	checkRole.checkWAdmin,
	getProductController.getAllProduct
);
router.get(
	"/:uuid",
	checkRole.checkUser,
	getProductController.getProductByUuid
);
router.post(
	"/",
	checkRole.checkAdmin,
	fileUploader({ destinationFolder: "productImg" }).array("productImg", 5),
	productController.insert
);
router.delete("/:id", checkRole.checkAdmin, productController.deleteProduct);
router.patch(
	"/:id",
	checkRole.checkAdmin,
	fileUploader({ destinationFolder: "productImg" }).array("productImg", 5),
	productController.editProduct
);

module.exports = router;
