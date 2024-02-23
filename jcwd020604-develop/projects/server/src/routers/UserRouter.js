const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;
const { fileUploader, upload } = require("../middlewares/multer");
const checkRole = require("../middlewares/roleDecoder");

router.get("/users", userController.getAll);
router.get("/users/:uuid", userController.getUsersById);
router.get("/users/role/:role", userController.getUsersByRole);
router.post("/users", checkRole.checkAdmin, userController.createUser);
router.patch("/users/role/:uuid", checkRole.checkAdmin, userController.editUser);
router.patch("/users/:uuid", userController.editUserV2);
router.delete("/users/role/:role/:uuid", checkRole.checkAdmin, userController.deleteUser);

router.post(
	"/:id",
	fileUploader({ destinationFolder: "userImg" }).single("userImg"),
	userController.insertImage
);

module.exports = router;
