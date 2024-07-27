const exprees = require("express");
const { body } = require("express-validator");

const spendingController = require("../controller/spending");
const isAuth = require("../middleware/isAuth");

const isPositiveNumeric = (value) => {
  if (!value || isNaN(value) || Number(value) < 0) {
    throw new Error("Number min 0 and positive number");
  }
  return true;
};

const router = exprees.Router();

router.get("/spendings", isAuth("admin"), spendingController.getSpending);

router.get("/spendings/exportPdf", isAuth("admin"), spendingController.exportPdf);

router.post(
  "/spendings",
  isAuth("admin"),
  [
    body("name", "please enter a name").trim().notEmpty(),
    body("price", "please enter a price").custom(isPositiveNumeric),
    body("quantity", "please enter a quantity").custom(isPositiveNumeric),
  ],
  spendingController.addSpending
);

router.get("/spendings/:spendingId", isAuth("admin"), spendingController.getSpendingById);

router.put(
  "/spendings/:spendingId",
  isAuth("admin"),
  [
    // body("name", "please enter a name").trim().notEmpty(),
    body("price", "please enter a price").custom(isPositiveNumeric),
    body("quantity", "please enter a quantity").custom(isPositiveNumeric),
  ],
  spendingController.updateSpending
);

router.delete("/spendings/:spendingId", isAuth("admin"), spendingController.deleteSpending);

module.exports = router;
