const { DataTypes } = require("sequelize");

const db = require("../utils/db");

const TransactionModels = db.define(
  "transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM,
      values: ["proses", "dapat diambil", "selesai"],
      defaultValue: "proses",
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
    },
    bahu: DataTypes.FLOAT,
    dada: DataTypes.FLOAT,
    panjang_tangan: DataTypes.FLOAT,
    panjang_badan: DataTypes.FLOAT,
    lebar_tangan: DataTypes.FLOAT,
    lebar_depan: DataTypes.FLOAT,
    lebar_belakang: DataTypes.FLOAT,
    lebar_pinggang: DataTypes.FLOAT,
    lebar_pinggul: DataTypes.FLOAT,
    price: {
      type: DataTypes.FLOAT,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = TransactionModels;
