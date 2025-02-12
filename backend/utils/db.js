const { Sequelize } = require("sequelize");
require("dotenv").config({ path: `.env${process.env.NODE_ENV}` });

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: "localhost",
  dialect: process.env.DB_DIALECT,
});

module.exports = db;
