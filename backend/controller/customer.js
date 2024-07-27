require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const User = require("../models/UserModels");
const { getClient, init } = require("../utils/clientWA");
const { generateRandomPassword } = require("../utils/randomPassowrd");

exports.getCusomters = (req, res, next) => {
  const search = req.query.search || "";

  const page = req.query.page || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  User.findAndCountAll({
    where: {
      role: "user",
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { no_whatsapp: { [Op.like]: `%${search}%` } },
      ],
    },
    limit: limit,
    offset: offset,
  })
    .then((customers) => {
      res.status(200).json({ customers });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createCustomer = async (req, res, next) => {
  const errors = validationResult(req);
  const name = req.body.name;
  const no_whatsapp = req.body.no_whatsapp;
  const username = req.body.username;
  // const password = "qwerty";
  const password = generateRandomPassword();

  const number = no_whatsapp + "@c.us";

  const message = `Halo *${name}*,

Selamat! Akun Anda telah berhasil dibuat.
  
Anda sekarang dapat login menggunakan rincian berikut:
  
Username: *${username}*
Password: *${password}*
  
Untuk login, silakan kunjungi *${process.env.FE_DOMAIN + "/login"}*
  
Jika Anda mengalami masalah saat login atau memiliki pertanyaan, jangan ragu untuk menghubungi tim dukungan kami.
  
Terima kasih telah bergabung dengan kami!
  
Salam hangat,
Tim Emi Tailor 🙏`;

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, name, no_whatsapp, password: passwordHash });
    await getClient().sendMessage(number, message);
    res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    // console.log(error);
    if (
      error.message.includes(
        "Protocol error (Runtime.callFunctionOn): Session closed. Most likely the page has been closed"
      )
    ) {
      console.log("Delete a user that was just created....");
      await User.destroy({ where: { username: username } });
      await init();
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getCustomerById = (req, res, next) => {
  const customerId = req.params.customerId;

  if (req.role === "user" && req.userId !== customerId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  User.findOne({ where: { id: customerId, role: "user" } })
    .then((customer) => {
      if (!customer) {
        return next(new Error("No customer found"));
      }
      res.status(200).json({ customer });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateCustomer = async (req, res, next) => {
  const customerId = req.params.customerId;
  const name = req.body.name;
  const no_whatsapp = req.body.no_whatsapp;
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (req.role === "user" && req.userId !== customerId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const errors = validationResult(req);

  const number = no_whatsapp + "@c.us";
  const message = `Halo *${name}*,

Selamat! Akun Anda telah berhasil diubah.
    
Anda sekarang dapat login menggunakan rincian berikut:
    
Username: *${username}*
${password !== "" ? `Password: *${password}*` : "Password: *Sama dengan sebelumnya*"}
    
Untuk login, silakan kunjungi *${process.env.FE_DOMAIN + "/login"}*
    
Jika Anda mengalami masalah saat login atau memiliki pertanyaan, jangan ragu untuk menghubungi tim dukungan kami.
    
Terima kasih telah bergabung dengan kami!
    
Salam hangat,
Tim Emi Tailor 🙏`;

  let user;

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    user = await User.findByPk(customerId);
    if (!user) {
      return next(new Error("user not found"));
    }

    let updateData = { name, no_whatsapp, username };

    if (password !== "") {
      if (password === confirmPassword) {
        const passwordHash = await bcrypt.hash(password, 12);
        updateData.password = passwordHash;
      } else {
        return res.status(422).json({ message: "confirm password is not the same as password" });
      }
    }

    await User.update(updateData, { where: { id: customerId } });

    await getClient().sendMessage(number, message);

    return res.status(200).json({ message: "User updated" });
  } catch (err) {
    if (
      err.message.includes(
        "Protocol error (Runtime.callFunctionOn): Session closed. Most likely the page has been closed"
      )
    ) {
      console.log("Delete a user that was just created....");
      const updateData = {
        name: user.name,
        no_whatsapp: user.no_whatsapp,
        username: user.username,
        password: user.password,
      };
      await User.update(updateData, { where: { id: customerId } });
      await init();
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletCustomer = (req, res, next) => {
  const customerId = req.params.customerId;

  User.findOne({ where: { id: customerId, role: "user" } })
    .then((customer) => {
      if (!customer) {
        return next(new Error("No Customer found"));
      }
      return User.destroy({ where: { id: customer.id } });
    })
    .then((deleteCustomer) => {
      res.status(200).json({ message: "Deleted customer success" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
