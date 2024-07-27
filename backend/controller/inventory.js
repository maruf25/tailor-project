const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const { validationResult } = require("express-validator");
const Inventory = require("../models/InventoryModels");
const { Op } = require("sequelize");

const fileHelper = require("../utils/deleteFile");
const puppeteer = require("puppeteer");
const PDFDocument = require("pdfkit");
const moment = require("moment");
const { generatePdf } = require("../utils/generatePdf");
const { inventoryHtml } = require("../utils/templateHtml");

exports.getInventories = (req, res, next) => {
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

  let whereCondition = {
    [Op.or]: [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ],
  };

  if (start !== "" && end !== "") {
    whereCondition = {
      ...whereCondition,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    };
  }

  Inventory.findAndCountAll({
    where: whereCondition,
    limit: limit,
    offset: offset,
  })
    .then((inventories) => {
      if (!inventories) {
        return next(new Error("No inventories found"));
      }
      res.status(200).json({ inventories });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createInventory = (req, res, next) => {
  const name = req.body.name;
  const quantity = req.body.quantity;
  const description = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  Inventory.create({ name, description, quantity })
    .then((inventory) => {
      res.status(201).json({ message: "Success create inventory", inventory });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getInventoryById = (req, res, next) => {
  const inventoryId = req.params.inventoryId;
  Inventory.findByPk(inventoryId)
    .then((inventory) => {
      if (!inventory) {
        return next(new Error("No inventory found"));
      }
      res.status(200).json({ inventory });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateInventory = (req, res, next) => {
  const inventoryId = req.params.inventoryId;
  const name = req.body.name;
  const description = req.body.description;
  const quantity = req.body.quantity;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  Inventory.findByPk(inventoryId)
    .then((inventory) => {
      if (!inventory) {
        return next(new Error("No inventory found"));
      }
      return Inventory.update({ name, description, quantity }, { where: { id: inventory.id } });
    })
    .then(() => {
      res.status(200).json({ message: "Update Inventory Success" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

// ================================= Delete Diubah menjadi reset =================================================

exports.deleteInventory = (req, res, next) => {
  const inventoryId = req.params.inventoryId;

  Inventory.findByPk(inventoryId)
    .then((inventory) => {
      if (!inventory) {
        return next(new Error("No inventory found"));
      }
      return Inventory.update({ quantity: 0 }, { where: { id: inventory.id } });
    })
    .then((update) => {
      res.status(200).json({ message: "Reset inventory success" });
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
      const offset = (i - 1) * limit;
      const startNumber = (i - 1) * limit;

      const inventories = await Inventory.findAll({
        limit: limit,
        offset: offset,
        where: whereCondition,
      });

      const htmlContent = inventoryHtml(inventories, startNumber);
      const tempHtmlPath = path.join(__dirname, "inventoryTemp.html");
      fs.writeFileSync(tempHtmlPath, htmlContent);
      await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle0" });

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
