require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/UserModels");

exports.signup = async (req, res, next) => {
  const name = req.body.name;
  const no_whatsapp = "1111111111111";
  const username = req.body.username;
  const password = req.body.password;

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      name,
      no_whatsapp,
      password: passwordHash,
      role: "admin",
    });
    res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      const error = new Error("User with this username could not be found");
      error.statusCode = 401;
      throw error;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).json({ token, userId: user.id, role: user.role, name: user.name });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.logout = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      const error = new Error("User login not found");
      error.statusCode = 401;
      throw error;
    }
    res.clearCookie("token");
    res.status(200).json({ message: "Logout Success" });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUsers = (req, res, next) => {
  User.findAll({
    where: { role: "admin" },
    attributes: ["id", "name", "username"],
  })
    .then((users) => {
      res.status(200).json({ users: users });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUser = async (req, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId, { attributes: ["name", "username", "role"] })
    .then((user) => {
      if (!user) {
        const error = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error;
      }
      res.status(200).json({ user: user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let updateData = { username, name };

    if (password !== "") {
      if (password === confirmPassword) {
        const passwordHash = await bcrypt.hash(password, 12);
        updateData.password = passwordHash;
      } else {
        return res.status(422).json({ message: "confirm password is not the same as password" });
      }
    }

    await User.update(updateData, { where: { id: userId } });

    res.status(200).json({ message: "User updated" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  User.destroy({ where: { id: userId } })
    .then((user) => {
      res.status(200).json({ message: "User deleted" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUserData = async (req, res, next) => {
  const userId = req.userId;
  User.findByPk(userId, { attributes: ["name", "username", "role"] })
    .then((user) => {
      if (!user) {
        const error = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error;
      }
      res.status(200).json({ user: user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
