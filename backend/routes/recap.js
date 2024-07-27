const exprees = require("express");

const recapController = require("../controller/recap");

const isAuth = require("../middleware/isAuth");

const router = exprees.Router();

router.get("/recap", isAuth("admin"), recapController.getRecap);

router.post("/exportPdf", isAuth("admin"), recapController.exportPdf);

module.exports = router;
