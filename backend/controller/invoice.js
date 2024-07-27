const { sendingInvoice } = require("../utils/sendingInvoice");
const Transaction = require("../models/TransactionModels");

exports.sendInvoice = async (req, res, next) => {
  const invoiceId = req.params.invoiceId;

  const name = req.body.name;
  const number = req.body.no_whatsapp;
  const status = req.body.status;

  try {
    const transaction = await Transaction.findByPk(invoiceId);
    const result = await sendingInvoice({
      invoiceId,
      name,
      no_whatsapp: number,
      status,
      order: {
        name: transaction.name,
        updatedAt: transaction.updatedAt,
        price: transaction.price.toString(),
      },
    });
    res.status(200).json({ message: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
