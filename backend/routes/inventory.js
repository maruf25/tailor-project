const exprees = require("express");
const { body } = require("express-validator");

const inventoryController = require("../controller/inventory");
const isAuth = require("../middleware/isAuth");

const isPositiveNumeric = (value) => {
  if (!value || isNaN(value) || Number(value) < 0) {
    throw new Error("Number min 0 and positive number");
  }
  return true;
};

const router = exprees.Router();

router.get("/inventories", isAuth("admin"), inventoryController.getInventories);

router.get("/inventories/exportPdf", isAuth("admin"), inventoryController.exportPdf);

router.post(
  "/inventories",
  isAuth("admin"),
  [
    body("name", "please enter a name").trim().notEmpty(),
    body("quantity", "please enter a quantity").custom(isPositiveNumeric),
    body("description", "please enter a description").trim().notEmpty(),
  ],
  inventoryController.createInventory
);

router.get("/inventories/:inventoryId", isAuth("admin"), inventoryController.getInventoryById);

router.put(
  "/inventories/:inventoryId",
  isAuth("admin"),
  [
    body("name", "please enter a name").trim().notEmpty(),
    body("quantity", "please enter a quantity").custom(isPositiveNumeric),
    body("description", "please enter a description").trim().notEmpty(),
  ],
  inventoryController.updateInventory
);

router.delete("/inventories/:inventoryId", isAuth("admin"), inventoryController.deleteInventory);

module.exports = router;
