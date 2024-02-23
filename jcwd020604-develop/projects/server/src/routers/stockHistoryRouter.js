const express = require("express");
const router = express.Router();
const getHistoryController = require("../controllers").getHistoryController;
const checkRole = require("../middlewares/roleDecoder");

router.get("/", checkRole.checkWAdmin, getHistoryController.getHistory);

module.exports = router;
