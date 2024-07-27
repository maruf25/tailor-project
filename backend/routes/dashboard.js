const express = require("express");

const dashboardController = require("../controller/dashboard");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/dashboard", isAuth(["admin", "user"]), dashboardController.getTotalData);

module.exports = router;
