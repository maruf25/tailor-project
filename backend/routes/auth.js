const express = require("express");
const { body } = require("express-validator");

const authController = require("../controller/auth");
const UserModels = require("../models/UserModels");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post(
  "/auth/signup",
  isAuth("admin"),
  [
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
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().notEmpty(),
  ],
  authController.signup
);

router.post("/auth/login", authController.login);
router.delete("/auth/logout", authController.logout);

router.get("/users", isAuth(["admin"]), authController.getUsers);

router.get("/users/:userId", isAuth(["admin"]), authController.getUser);

router.put(
  "/users/:userId",
  isAuth("admin"),
  [
    body("name").trim().notEmpty(),
    body("username", "Please enter valid username").custom(async (value, { req }) => {
      try {
        const userDoc = await UserModels.findOne({ where: { username: value } });

        if (userDoc && req.params.userId !== userDoc.id) {
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
  authController.updateUser
);

router.delete("/users/:userId", isAuth("admin"), authController.deleteUser);

router.get("/userdata", isAuth(["admin", "user"]), authController.getUserData);

module.exports = router;
