const exprees = require("express");
const { body } = require("express-validator");

const customerController = require("../controller/customer");
const isAuth = require("../middleware/isAuth");
const UserModels = require("../models/UserModels");

const isNoWhatsapp = (value) => {
  if (Number(value) < 1 || value.toString().length < 13 || value.toString().length > 15) {
    throw new Error("Number min 13 and max length 15 number");
  }
  return true;
};

const router = exprees.Router();

router.get("/customer", isAuth("admin"), customerController.getCusomters);

router.post(
  "/customer",
  isAuth("admin"),
  [
    body("name", "please enter a name").trim().notEmpty(),
    body("no_whatsapp").custom(isNoWhatsapp),
    body("username", "Please enter valid username")
      .matches(/^\S+$/, "g")
      .withMessage("Username should not contain spaces")
      .custom(async (value, { req }) => {
        try {
          const userDoc = await UserModels.findOne({ where: { username: value } });

          if (userDoc) {
            return Promise.reject("username already exists");
          }
        } catch (err) {
          // Tangkap dan lempar kesalahan untuk mengarahkan ke middleware error
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          return Promise.reject(err);
        }
      }),
  ],
  customerController.createCustomer
);

router.get("/customer/:customerId", isAuth(["admin", "user"]), customerController.getCustomerById);

router.put(
  "/customer/:customerId",
  isAuth(["admin", "user"]),
  [
    body("name", "please enter a name").trim().notEmpty(),
    body("no_whatsapp").custom(isNoWhatsapp),
    body("username", "Please enter valid username")
      .matches(/^\S+$/, "g")
      .withMessage("Username should not contain spaces")
      .custom(async (value, { req }) => {
        try {
          const userDoc = await UserModels.findOne({ where: { username: value } });

          if (userDoc && req.params.customerId !== userDoc.id) {
            return Promise.reject("username already exists");
          }
        } catch (err) {
          // Tangkap dan lempar kesalahan untuk mengarahkan ke middleware error
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          return Promise.reject(err);
        }
      }),
    body("password").custom((value, { req }) => {
      if (value === "") {
        return true;
      } else if (value.length < 5) {
        throw new Error("Password must be at least 5 characters long");
      }
      return true;
    }),
  ],
  customerController.updateCustomer
);

router.delete("/customer/:customerId", isAuth("admin"), customerController.deletCustomer);

module.exports = router;
