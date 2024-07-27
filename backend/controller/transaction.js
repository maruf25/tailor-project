const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { validationResult } = require("express-validator");
const Transaction = require("../models/TransactionModels");
const fileHelper = require("../utils/deleteFile");
const { Op } = require("sequelize");
const puppeteer = require("puppeteer");
const PDFDocument = require("pdfkit");

const User = require("../models/UserModels");
const { sendingInvoice } = require("../utils/sendingInvoice");

const { generatePdf } = require("../utils/generatePdf");
const moment = require("moment");
const { orderHtml, transactionHtml } = require("../utils/templateHtml");

exports.getTransactions = (req, res, next) => {
  const { role, userId } = req;
  const search = req.query.search || "";

  const start = req.query.start || "";
  const end = req.query.end || "";

  const startDate = new Date(start);
  const endDate = new Date(end);
  startDate.setHours(0, 0, 1, 0);
  endDate.setHours(23, 59, 59, 999);

  const page = req.query.page || 1;
  const limit = 4;
  const offset = (page - 1) * limit;

  let whereCondition = {
    status: "selesai",
    [Op.or]: [
      { name: { [Op.like]: `%${search}%` } },
      { "$user.name$": { [Op.like]: `%${search}%` } },
      { "$user.no_whatsapp$": { [Op.like]: `%${search}%` } },
    ],
  };

  if (role === "user") {
    whereCondition = {
      ...whereCondition,
      userId: userId,
    };
  }

  if (start !== "" && end !== "") {
    whereCondition = {
      ...whereCondition,
      updatedAt: {
        [Op.between]: [startDate, endDate],
      },
    };
  }

  Transaction.findAndCountAll({
    include: [
      {
        model: User,
        required: true,
      },
    ],
    limit: limit,
    offset: offset,
    where: whereCondition,
  })
    .then((transactions) => {
      res.status(200).json({ transactions });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getOrders = (req, res, next) => {
  const { role, userId } = req;
  const search = req.query.search || "";
  const recent = req.query.recent === "true";

  const start = req.query.start || "";
  const end = req.query.end || "";
  const startDate = new Date(start);
  const endDate = new Date(end);
  startDate.setHours(0, 0, 1, 0);
  endDate.setHours(23, 59, 59, 999);

  const page = req.query.page || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  let whereCondition = {
    status: { [Op.ne]: "selesai" },
    [Op.or]: [
      { name: { [Op.like]: `%${search}%` } },
      { "$user.name$": { [Op.like]: `%${search}%` } },
      { "$user.no_whatsapp$": { [Op.like]: `%${search}%` } },
    ],
  };

  if (role === "user") {
    whereCondition = {
      ...whereCondition,
      userId: userId,
    };
  }

  if (start !== "" && end !== "") {
    whereCondition = {
      ...whereCondition,
      updatedAt: { [Op.between]: [startDate, endDate] },
    };
  }

  const options = {
    include: [
      {
        model: User,
        required: true,
      },
    ],
    where: whereCondition,
    limit: limit,
    offset: offset,
    order: [["createdAt", "ASC"]],
  };

  if (recent) {
    options.limit = 2;
    options.order = [["createdAt", "DESC"]];
  }

  if (start !== "" && end !== "") {
    whereCondition = {
      ...whereCondition,
      updatedAt: { [Op.between]: [start, end] },
    };
  }

  Transaction.findAndCountAll(options)
    .then((transactions) => {
      res.status(200).json({ transactions });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createTransaction = async (req, res, next) => {
  const name = req.body.name;
  const image = req.file ? req.file.path.replace("\\", "/") : null;
  const description = req.body.description;
  const status = req.body.status;
  const deadline = req.body.deadline;
  const price = req.body.price;
  const bahu = req.body.bahu;
  const dada = req.body.dada;
  const panjang_tangan = req.body.panjang_tangan;
  const panjang_badan = req.body.panjang_badan;
  const lebar_tangan = req.body.lebar_tangan;
  const lebar_depan = req.body.lebar_depan;
  const lebar_belakang = req.body.lebar_belakang;
  const lebar_pinggang = req.body.lebar_pinggang;
  const lebar_pinggul = req.body.lebar_pinggul;
  const customerId = req.body.customerId;

  const errors = validationResult(req);

  let no_whatsapp;
  let invoiceId;

  try {
    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    if (!image) {
      const error = new Error("No Image Provided");
      error.statusCode = 422;
      error.data = [{ path: "image", msg: "Please upload Image" }];
      throw error;
    }

    const user = await User.findByPk(customerId);
    if (!user) {
      return next(new Error("user not found"));
    }
    no_whatsapp = user.no_whatsapp;

    const transaction = await user.createTransaction({
      name,
      image,
      description,
      status,
      deadline,
      bahu,
      dada,
      panjang_tangan,
      panjang_badan,
      lebar_tangan,
      lebar_depan,
      lebar_belakang,
      lebar_pinggang,
      lebar_pinggul,
      price,
    });

    invoiceId = transaction.id;

    await sendingInvoice({
      invoiceId,
      name: user.name,
      status,
      no_whatsapp: no_whatsapp,
      order: {
        name,
        updatedAt: transaction.updatedAt,
        price,
      },
    });

    res.status(201).json({ message: "Created transaction success and send invoice" });
  } catch (err) {
    if (
      err.message.includes(
        "Protocol error (Runtime.callFunctionOn): Session closed. Most likely the page has been closed"
      )
    ) {
      console.log("Delete a order that was just created....");
      await Transaction.destroy({ where: { id: invoiceId } });
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTransactionById = (req, res, next) => {
  const { role, userId } = req;
  const transactionId = req.params.transactionId;

  let whereCondition = {
    id: transactionId,
  };

  if (role === "user") {
    whereCondition = {
      ...whereCondition,
      userId: userId,
    };
  }

  Transaction.findOne({
    where: whereCondition,
    include: { model: User, attributes: ["name", "no_whatsapp", "username", "id"] },
  })
    .then((transaction) => {
      if (!transaction) {
        return next(new Error("No transaction found"));
      }
      res.status(200).json({ transaction });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateTransaction = async (req, res, next) => {
  const transactionId = req.params.transactionId;
  const name = req.body.name;
  const image = req.file ? req.file.path.replace("\\", "/") : null;
  const description = req.body.description;
  const status = req.body.status;
  const deadline = req.body.deadline;
  const price = req.body.price;
  const bahu = req.body.bahu;
  const dada = req.body.dada;
  const panjang_tangan = req.body.panjang_tangan;
  const panjang_badan = req.body.panjang_badan;
  const lebar_tangan = req.body.lebar_tangan;
  const lebar_depan = req.body.lebar_depan;
  const lebar_belakang = req.body.lebar_belakang;
  const lebar_pinggang = req.body.lebar_pinggang;
  const lebar_pinggul = req.body.lebar_pinggul;
  const customerId = req.body.customerId;

  const errors = validationResult(req);

  let updateData = {
    name,
    description,
    status,
    deadline,
    bahu,
    dada,
    panjang_tangan,
    panjang_badan,
    lebar_tangan,
    lebar_depan,
    lebar_belakang,
    lebar_pinggang,
    lebar_pinggul,
    price,
    userId: customerId,
  };
  if (image) {
    updateData.image = image;
  }

  let no_whatsapp;
  let transaction;

  try {
    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    transaction = await Transaction.findByPk(transactionId, { include: User });
    if (!transaction) {
      return next(new Error("No transaction found"));
    }
    if (transaction.status === "selesai") {
      return next(new Error("Transaction can't update because transaction is done"));
    }

    no_whatsapp = transaction.user.no_whatsapp;
    await Transaction.update(updateData, { where: { id: transactionId } });
    await sendingInvoice({
      invoiceId: transactionId,
      name: transaction.user.name,
      status,
      no_whatsapp: no_whatsapp,
      order: {
        name: updateData.name,
        updatedAt: moment(),
        price: updateData.price.toString(),
      },
    });
    if (image) {
      fileHelper.deleteFile(transaction.image);
    }

    res.status(200).json({ message: "Updated transaction and send invoice success" });
  } catch (err) {
    if (
      err.message.includes(
        "Protocol error (Runtime.callFunctionOn): Session closed. Most likely the page has been closed"
      )
    ) {
      console.log("Rollback a order that was just updated...");
      updateData = {
        name: transaction.name,
        description: transaction.description,
        image: transaction.image,
        status: transaction.status,
        deadline: transaction.deadline,
        bahu: transaction.bahu,
        dada: transaction.dada,
        panjang_tangan: transaction.panjang_tangan,
        panjang_badan: transaction.panjang_badan,
        lebar_tangan: transaction.lebar_tangan,
        lebar_depan: transaction.lebar_depan,
        lebar_belakang: transaction.lebar_belakang,
        lebar_pinggang: transaction.lebar_pinggang,
        lebar_pinggul: transaction.lebar_pinggul,
        price: transaction.price,
        userId: customerId,
      };
      await Transaction.update(updateData, { where: { id: transactionId } });
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteTransaction = (req, res, next) => {
  const transactionId = req.params.transactionId;

  Transaction.findByPk(transactionId)
    .then((transaction) => {
      if (transaction.status === "selesai") {
        throw new Error("Transaction can't delete because transaction is done");
      }
      fileHelper.deleteFile(transaction.image);
      return Transaction.destroy({ where: { id: transaction.id } });
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted transaction success" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.transactionsExportPdf = async (req, res, next) => {
  // const token = req.cookies.token;
  const { role, userId } = req;
  const start = req.query.start || "";
  const end = req.query.end || "";
  const length = req.query.length || 0;
  const variant = req.query.variant;

  // console.log("======================== Length ================== " + length);
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({
      width: 1280,
      height: 800,
    });

    // await page.setCookie({
    //   name: "token",
    //   value: token,
    //   domain: "localhost",
    // });

    // const baseUrl = process.env.FE_DOMAIN + `dashboard/${variant}`;

    // let params = new URLSearchParams();

    // if (start !== "" && end !== "") {
    //   params.append("start", start);
    //   params.append("end", end);
    // }

    // Create a new PDF document
    const doc = new PDFDocument({
      size: "A4",
    });

    // Setup the response to download the PDF file
    let fileName = `${variant.toUpperCase()} All of Time.pdf`;
    let periode = "Periode : All of Time";

    if (moment(start, "YYYY-MM-DD", true).isValid() || moment(end, "YYYY-MM-DD", true).isValid()) {
      fileName = `${variant.toUpperCase()} ${start} sampai ${end}.pdf`;
      periode = `Periode: ${moment(start, "YYYY-MM-DD").format("DD-MM-YYYY")} sampai ${moment(
        end,
        "YYYY-MM-DD"
      ).format("DD-MM-YYYY")}`;
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    doc.pipe(res);

    // Add custom text to the PDF
    const logoWidth = 60;
    const logoHeight = 60;
    const pageWidth = doc.page.width;
    const xCenter = (pageWidth - logoWidth) / 2;

    doc.image("Logo.png", xCenter, 20, { width: logoWidth, height: logoHeight });
    doc.moveDown();
    doc.font("Times-Bold").fontSize(16).text("Emi Tailor", { align: "center" });
    doc.font("Times-Roman");
    doc.moveDown();
    doc.fontSize(12).text(`LAPORAN ${variant.toUpperCase()}`, { align: "center" });
    doc.moveDown();
    doc.text(periode, { align: "center" });

    let whereCondition = {
      status: "selesai",
    };
    if (role === "user") {
      whereCondition = {
        ...whereCondition,
        userId: userId,
      };
    }

    if (start !== "" && end !== "") {
      whereCondition = {
        ...whereCondition,
        updatedAt: { [Op.between]: [start, end] },
      };
    }

    for (let i = 1; i <= length; i++) {
      const limit = 4;
      let offset = (i - 1) * limit;
      const startNumber = (i - 1) * limit;

      const transactions = await Transaction.findAll({
        include: [{ model: User, required: true }],
        limit: limit,
        offset: offset,
        where: whereCondition,
      });

      const htmlContent = transactionHtml(transactions, role, startNumber);
      const tempHtmlPath = path.join(__dirname, "transactionTemp.html");
      fs.writeFileSync(tempHtmlPath, htmlContent);
      await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle0" });

      // params.set("page", i);
      // const urlApi = `${baseUrl}?${params.toString()}`;

      // await page.goto(urlApi, {
      //   waitUntil: "networkidle0",
      // });

      // await page.evaluate((variant) => {
      //   const table = document.querySelector(`#table${variant}`);
      //   if (table) {
      //     const actionHeader = document.getElementById("actionHeader");
      //     const actionCells = document.querySelectorAll("#actionCell");

      //     if (actionHeader) actionHeader.remove();
      //     actionCells.forEach((cell) => cell.remove());
      //   }
      // }, variant);

      const element = await page.$(`#table${variant}`);
      const boundingBox = await element.boundingBox();
      const imageTable = await element.screenshot();

      fs.writeFileSync("table.png", imageTable);

      if (i > 1) {
        doc.addPage();
      }
      doc.image(imageTable, 0, doc.y + 5, {
        fit: [doc.page.width, boundingBox.height],
        align: "center",
      });
      fs.unlinkSync("table.png");
    }

    await browser.close();

    doc.end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.ordersExportPdf = async (req, res, next) => {
  // const token = req.cookies.token;
  const start = req.query.start || "";
  const end = req.query.end || "";
  const length = req.query.length || 0;
  const variant = req.query.variant;

  // console.log("======================== Length ================== " + length);
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({
      width: 1280,
      height: 800,
    });

    // Create a new PDF document
    const doc = new PDFDocument({
      size: "A4",
    });

    // Setup the response to download the PDF file
    let fileName = `${variant.toUpperCase()} All of Time.pdf`;
    let periode = "Periode : All of Time";

    if (moment(start, "YYYY-MM-DD", true).isValid() || moment(end, "YYYY-MM-DD", true).isValid()) {
      fileName = `${variant.toUpperCase()} ${start} sampai ${end}.pdf`;
      periode = `Periode: ${moment(start, "YYYY-MM-DD").format("DD-MM-YYYY")} sampai ${moment(
        end,
        "YYYY-MM-DD"
      ).format("DD-MM-YYYY")}`;
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    doc.pipe(res);

    // Add custom text to the PDF
    const logoWidth = 60;
    const logoHeight = 60;
    const pageWidth = doc.page.width;
    const xCenter = (pageWidth - logoWidth) / 2;

    doc.image("Logo.png", xCenter, 20, { width: logoWidth, height: logoHeight });
    doc.moveDown();
    doc.font("Times-Bold").fontSize(16).text("Emi Tailor", { align: "center" });
    doc.font("Times-Roman");
    doc.moveDown();
    doc.fontSize(12).text(`LAPORAN ${variant.toUpperCase()}`, { align: "center" });
    doc.moveDown();
    doc.text(periode, { align: "center" });

    let whereCondition = {
      status: { [Op.ne]: "selesai" },
    };

    if (start !== "" && end !== "") {
      whereCondition = {
        ...whereCondition,
        updatedAt: { [Op.between]: [start, end] },
      };
    }

    for (let i = 1; i <= length; i++) {
      const limit = 5;
      let offset = (i - 1) * limit;
      const startNumber = (i - 1) * limit;

      const orders = await Transaction.findAll({
        include: [{ model: User, required: true }],
        limit: limit,
        offset: offset,
        where: whereCondition,
        order: [["createdAt", "ASC"]],
      });

      const htmlContent = orderHtml(orders, startNumber);
      const tempHtmlPath = path.join(__dirname, "orderTemp.html");
      fs.writeFileSync(tempHtmlPath, htmlContent);
      await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle0" });

      const element = await page.$(`#tableorder`);
      const boundingBox = await element.boundingBox();
      const imageTable = await element.screenshot();

      fs.writeFileSync("table.png", imageTable);

      if (i > 1) {
        doc.addPage();
      }
      doc.image(imageTable, 0, doc.y + 5, {
        fit: [doc.page.width, boundingBox.height],
        align: "center",
      });
      fs.unlinkSync("table.png");
    }

    await browser.close();

    doc.end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
