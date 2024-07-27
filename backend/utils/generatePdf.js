require("dotenv").config();
const puppeteer = require("puppeteer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const moment = require("moment");
exports.generatePdf = async (token, start, end, length, variant, res) => {
  // console.log("======================== Length ================== " + length);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({
      width: 1280,
      height: 800,
    });

    await page.setCookie({
      name: "token",
      value: token,
      domain: "localhost",
    });

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

    for (let i = 1; i <= length; i++) {
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
    throw(error);
  }
};
