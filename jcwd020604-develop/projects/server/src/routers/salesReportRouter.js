const express = require("express");
const router = express.Router();
const salesReportController = require("../controllers").salesReportController;

router.post("/report", salesReportController.getData);

module.exports = router;
