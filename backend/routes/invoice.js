const express = require("express");

const invoiceController = require("../controller/invoice");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post("/invoice/:invoiceId", isAuth("admin"), invoiceController.sendInvoice);

module.exports = router;
