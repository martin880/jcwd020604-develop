const express = require("express");
const router = express.Router();
const stockMutation = require("../controllers").stockMutationController;
const handleStockMutation =
	require("../controllers").handleStockMutationController;
const getStockMutation = require("../controllers").getStockMutationController;
const checkRole = require("../middlewares/roleDecoder");

router.get("/", checkRole.checkWAdmin, getStockMutation.getMutation);

router.get(
	"/mutation/request",
	checkRole.checkWAdmin,
	getStockMutation.getMutationRequest
);

router.post("/", checkRole.checkWAdmin, stockMutation.requestMutation);

router.patch(
	"/mutation/handle/:id",
	checkRole.checkWAdmin,
	handleStockMutation.handleMutation
);

router.patch("/:id", checkRole.checkWAdmin, stockMutation.editMutation);

router.delete("/:id", checkRole.checkWAdmin, stockMutation.cancelMutation);

module.exports = router;
