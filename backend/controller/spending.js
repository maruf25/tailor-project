require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const Spending = require("../models/SpendingModels");
const Inventory = require("../models/InventoryModels");

const { generatePdf } = require("../utils/generatePdf");
const { spendingHtml } = require("../utils/templateHtml");
const puppeteer = require("puppeteer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

exports.getSpending = (req, res, next) => {
  const search = req.query.search || "";
  const page = req.query.page || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const start = req.query.start || "";
  const end = req.query.end || "";

  const startDate = new Date(start);
  const endDate = new Date(end);
  startDate.setHours(0, 0, 1, 0);
  endDate.setHours(23, 59, 59, 999);

  let whereCondition = {};

  if (start !== "" && end !== "") {
    whereCondition = {
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };
  }

  Spending.findAndCountAll({
    where: whereCondition,
    include: {
      model: Inventory,
      where: {
        [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
      },
    },
    limit: limit,
    offset: offset,
    order: [["createdAt", "DESC"]],
  })
    .then((spendings) => {
      if (!spendings) {
        return next(new Error("No spendings found"));
      }
      res.status(200).json({ spendings });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addSpending = async (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const quantity = req.body.quantity;

  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    let inventory = await Inventory.findOne({ where: { name: name } });

    if (!inventory) {
      inventory = await Inventory.create({
        name: name,
        description: "Item baru",
        quantity: quantity,
      });
    } else {
      await Inventory.update(
        { quantity: Number(inventory.quantity) + Number(quantity) },
        { where: { name: name } }
      );
    }
    inventory = await Inventory.findOne({ where: { name: name } });
    const spending = await Spending.create({
      price,
      quantity,
      inventoryId: inventory.id,
      userId: req.userId,
    });
    res.status(201).json({ message: "success create spendings", spending });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSpendingById = (req, res, next) => {
  const spendingId = req.params.spendingId;

  Spending.findByPk(spendingId, { include: { model: Inventory, attributes: ["name", "id"] } })
    .then((spending) => {
      if (!spending) {
        return next(new Error("No spending found"));
      }
      res.status(200).json({ spending });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// ================================== Sudah Diubah Update dan Delete Perlu cek ulang ==================================

// Update hanya dapat mengubah price dan quantity
exports.updateSpending = async (req, res, next) => {
  const spendingId = req.params.spendingId;
  // const name = req.body.name;
  const price = req.body.price;
  const quantity = req.body.quantity;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  let dataSpending;

  Spending.findByPk(spendingId)
    .then((spending) => {
      if (!spending) {
        return next(new Error("No spending found"));
      }
      dataSpending = spending;
      return spending.getInventory();
    })
    .then((inventory) => {
      const oldQuantitySpending = Number(dataSpending.quantity);
      const newQuantitySpending = Number(quantity);
      const oldQuantityInventory = Number(inventory.quantity);

      let valueQuantity = oldQuantityInventory - oldQuantitySpending + newQuantitySpending;

      if (valueQuantity < 0) {
        valueQuantity = 0;
      }

      return inventory.update({ quantity: valueQuantity });
    })
    .then((inventoryUpdate) => {
      return dataSpending.update({ price: price, quantity: quantity });
    })
    .then((spendingUpdate) => {
      res.status(200).json({ message: "Spending update success!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteSpending = (req, res, next) => {
  const spendingId = req.params.spendingId;
  let dataSpending;
  Spending.findByPk(spendingId)
    .then((spending) => {
      if (!spending) {
        return next(new Error("No spending found"));
      }
      dataSpending = spending;
      return spending.getInventory();
    })
    .then((inventory) => {
      const oldSpendingQty = Number(dataSpending.quantity);
      const oldInventoryQty = Number(inventory.quantity);

      let valueQuantity = oldInventoryQty - oldSpendingQty;
      if (valueQuantity < 0) {
        valueQuantity = 0;
      }
      return inventory.update({ quantity: valueQuantity });
    })
    .then((inventoryUpdate) => {
      return dataSpending.destroy();
    })
    .then((spendingDestroy) => {
      res.status(200).json({ message: "Deleted spending success!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.exportPdf = async (req, res, next) => {
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

    let whereCondition = {};

    if (start !== "" && end !== "") {
      whereCondition = {
        createdAt: {
          [Op.between]: [start, end],
        },
      };
    }

    for (let i = 1; i <= length; i++) {
      let limit = 10;
      const startNumber = (i - 1) * limit;
      const offset = (i - 1) * limit;

      const spendings = await Spending.findAll({
        include: [{ model: Inventory, required: true }],
        limit: limit,
        offset: offset,
        where: whereCondition,
        order: [["createdAt", "DESC"]],
      });

      const htmlContent = spendingHtml(spendings, startNumber);
      const tempHtmlPath = path.join(__dirname, "spendingTemp.html");
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
