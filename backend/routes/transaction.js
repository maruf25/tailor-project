const exprees = require("express");
const { body } = require("express-validator");

const transactionController = require("../controller/transaction");
const isAuth = require("../middleware/isAuth");

const isPositiveNumeric = (value) => {
  if (!value || isNaN(value) || Number(value) < 1) {
    throw new Error("Number min 0 and positive number");
  }
  return true;
};

const router = exprees.Router();

router.get("/orders", isAuth(["admin", "user"]), transactionController.getOrders);

router.get("/transactions", isAuth(["admin", "user"]), transactionController.getTransactions);

router.get(
  "/transactions/exportPdf",
  isAuth(["admin", "user"]),
  transactionController.transactionsExportPdf
);

router.get("/orders/exportPdf", isAuth("admin"), transactionController.ordersExportPdf);

router.post(
  "/transactions",
  isAuth("admin"),
  [
    body("name", "please enter a name").trim().notEmpty(),
    body("description", "please enter a description").trim().notEmpty(),
    body("deadline", "please enter a deadline").trim().notEmpty(),
    body("bahu").custom(isPositiveNumeric),
    body("dada").custom(isPositiveNumeric),
    body("panjang_tangan").custom(isPositiveNumeric),
    body("panjang_badan").custom(isPositiveNumeric),
    body("lebar_tangan").custom(isPositiveNumeric),
    body("lebar_depan").custom(isPositiveNumeric),
    body("lebar_belakang").custom(isPositiveNumeric),
    body("lebar_pinggang").custom(isPositiveNumeric),
    body("lebar_pinggul").custom(isPositiveNumeric),
    body("price").custom(isPositiveNumeric),
    body("customerId", "please enter a customerId").trim().notEmpty(),
  ],
  transactionController.createTransaction
);

router.get(
  "/transactions/:transactionId",
  isAuth(["admin", "user"]),
  transactionController.getTransactionById
);

router.put(
  "/transactions/:transactionId",
  isAuth("admin"),
  [
    body("name", "please enter a name").trim().notEmpty(),
    body("description", "please enter a description").trim().notEmpty(),
    body("deadline", "please enter a deadline").trim().notEmpty(),
    body("bahu").custom(isPositiveNumeric),
    body("dada").custom(isPositiveNumeric),
    body("panjang_tangan").custom(isPositiveNumeric),
    body("panjang_badan").custom(isPositiveNumeric),
    body("lebar_tangan").custom(isPositiveNumeric),
    body("lebar_depan").custom(isPositiveNumeric),
    body("lebar_belakang").custom(isPositiveNumeric),
    body("lebar_pinggang").custom(isPositiveNumeric),
    body("lebar_pinggul").custom(isPositiveNumeric),
    body("price").custom(isPositiveNumeric),
    body("customerId", "please enter a customerId").trim().notEmpty(),
  ],
  transactionController.updateTransaction
);

router.delete(
  "/transactions/:transactionId",
  isAuth("admin"),
  transactionController.deleteTransaction
);

module.exports = router;
