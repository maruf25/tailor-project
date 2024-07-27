const { Sequelize } = require("sequelize");
const Spending = require("../models/SpendingModels");
const Transaction = require("../models/TransactionModels");
const { Op } = require("sequelize");

exports.getTotalData = async (req, res, next) => {
  const { role, userId } = req;

  try {
    let totalSpending, totalIncome, totalTransksi, totalOrder;
    if (role === "user") {
      totalSpending = 0;

      totalIncome = 0;

      totalTransksi = await Transaction.count({ where: { status: "selesai", userId: userId } });

      totalOrder = await Transaction.count({
        where: { status: { [Op.ne]: "selesai" }, userId: userId },
      });
    } else {
      totalSpending = await Spending.sum("price");

      totalIncome = await Transaction.sum("price", { where: { status: "selesai" } });

      totalTransksi = await Transaction.count({ where: { status: "selesai" } });

      totalOrder = await Transaction.count({ where: { status: { [Op.ne]: "selesai" } } });
    }

    res.status(200).json({
      total_pengeluaran: totalSpending || 0,
      total_pendapatan: totalIncome || 0,
      total_transaksi: totalTransksi,
      total_booking: totalOrder,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
