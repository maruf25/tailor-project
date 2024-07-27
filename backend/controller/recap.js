require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const path = require("path");
const db = require("../utils/db");

const Spending = require("../models/SpendingModels");
const Transaction = require("../models/TransactionModels");
const { Sequelize, Op } = require("sequelize");
const puppeteer = require("puppeteer");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const moment = require("moment");

const formatRupiah = (angka) => {
  const number_string = angka.replace(/[^\d]/g, "").toString();
  const sisa = number_string.length % 3;
  let rupiah = number_string.substr(0, sisa);
  const ribuan = number_string.substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return "Rp. " + rupiah;
};

exports.getRecap = async (req, res, next) => {
  const start = req.query.start || "";
  const end = req.query.end || "";
  try {
    // console.log(start);
    const query = `
      SELECT name, price AS amount, updatedAt AS date, 'masuk' AS tipe
      FROM transactions
      WHERE status = :status AND DATE(updatedAt) >= :start AND DATE(updatedAt) <= :end
      UNION ALL
      SELECT inventories.name, spendings.price AS amount, spendings.createdAt AS date, 'keluar' AS tipe 
      FROM spendings INNER JOIN inventories ON spendings.inventoryId = inventories.id
      WHERE spendings.price > :price AND DATE(spendings.createdAt) >= :start AND DATE(spendings.createdAt) <= :end
      ORDER BY date ASC;
    `;

    const [results, metadata] = await db.query(query, {
      replacements: { status: "selesai", price: 0, start: start, end: end },
    });

    const totalIncome = await Transaction.sum("price", {
      where: {
        [Op.and]: [
          Sequelize.literal(`DATE(updatedAt) >= :start AND DATE(updatedAt) <= :end`),
          {
            status: "selesai",
          },
        ],
      },
      replacements: { start: start, end: end },
    });

    const totalSpending = await Spending.sum("price", {
      where: {
        [Op.and]: [
          Sequelize.literal(`DATE(createdAt) >= :start AND DATE(createdAt) <= :end`),
          {
            price: { [Op.gt]: 0 },
          },
        ],
      },
      replacements: { start: start, end: end },
    });

    const saldo = totalIncome - totalSpending;

    res.status(200).json({ data: results, totalIncome, totalSpending, saldo });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.exportPdf = async (req, res, next) => {
  // const token = req.cookies.token;
  const start = req.body.start;
  const end = req.body.end;

  const recaps = req.body.recaps;
  const total = req.body.total;

  const htmlContent = `
   <html>
      <head>
        <meta charset="UTF-8">
        <title>Recap</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
          <div class="relative mt-5 overflow-x-auto shadow-md sm:rounded-lg">
          <table id="tableRecap" class="w-full text-sm text-left text-gray-500 rtl:text-right ">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th scope="col" class="px-6 py-3">
                  No
                </th>
                <th scope="col" class="px-6 py-3">
                  Category
                </th>
                <th scope="col" class="px-6 py-3">
                  Tanggal
                </th>
                <th scope="col" class="px-6 py-3">
                  Name
                </th>
                <th scope="col" class="px-6 py-3">
                  Masuk
                </th>
                <th scope="col" class="px-6 py-3">
                  Keluar
                </th>
              </tr>
            </thead>
            <tbody>
              ${
                recaps.length === 0 &&
                `<tr class="bg-white border-b hover:bg-gray-50 ">
                    <td
                      scope="row"
                      colSpan={5}
                      class="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap "
                    >
                      No Data Found
                    </td>
                  </tr>`
              }
              ${recaps.map(
                (recap, key) =>
                  `<tr key={key} class="bg-white border-b hover:bg-gray-50 ">
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    ${key + 1}
                  </th>
                  <td class="px-6 py-4 font-bold">
                    ${
                      recap.tipe === "masuk"
                        ? `<p class="text-green-700">PEMASUKAN</p>`
                        : `<p class="text-red-700">PENGELUARAN</p>`
                    }
                  </td>
                  <td class="px-6 py-4">${moment(recap.date).format("LLLL")}</td>
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    ${recap.name}
                  </th>
                  <td class="px-6 py-4 text-right">
                    ${recap.tipe === "masuk" ? formatRupiah(recap.amount.toString()) : 0}
                  </td>
                  <td class="px-6 py-4 text-right">
                    ${recap.tipe === "keluar" ? formatRupiah(recap.amount.toString()) : 0}
                  </td>
                </tr>`
              )}
              <tr class="bg-white border-b hover:bg-gray-50 ">
                <td
                  colSpan="4"
                  scope="row"
                  class="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap "
                >
                  Total Pemasukan dan Pengeluaran
                </td>
                <td class="px-6 py-4 text-right">
                  ${total?.totalIncome ? formatRupiah(total.totalIncome.toString()) : 0}
                </td>
                <td class="px-6 py-4 text-right">
                  ${total?.totalSpending ? formatRupiah(total.totalSpending.toString()) : 0}
                </td>
              </tr>
              <tr class="bg-white border-b hover:bg-gray-50 ">
                <td
                  colSpan="4"
                  scope="row"
                  class="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap "
                >
                  Saldo
                </td>
                <td colSpan="2" class="px-6 py-4 text-center">
                  ${total?.saldo ? formatRupiah(total.saldo.toString()) : 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;

  const tempHtmlPath = path.join(__dirname, "tempRecap.html");
  fs.writeFileSync(tempHtmlPath, htmlContent);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({
      width: 1600,
      height: 800,
    });

    // await page.setCookie({
    //   name: "token",
    //   value: token,
    //   domain: "localhost",
    // });

    // await page.goto(`${process.env.FE_DOMAIN}/dashboard/recap?start=` + start + "&end=" + end, {
    //   waitUntil: "networkidle0",
    // });

    await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle0" });

    const element = await page.$("#tableRecap");
    const boundingBox = await element.boundingBox();
    const imageTable = await element.screenshot();

    fs.writeFileSync("table.png", imageTable);

    await browser.close();

    const pageHeight = boundingBox.height > 841.89 ? boundingBox.height - 300 : 841.89;
    console.log(pageHeight);

    // Create a new PDF document
    const doc = new PDFDocument({
      size: [595.28, pageHeight],
      // size: "A4",
    });
    // Setup the response to download the PDF file\
    const fileName = `${moment(start, "MM-DD-YYYY").format("DD-MM-YYYY")} sampai ${moment(
      end,
      "MM-DD-YYYY"
    ).format("DD-MM-YYY")}.pdf`;
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
    doc.fontSize(12).text(`Laporan Pemasukan dan Pengeluaran`, { align: "center" });
    doc.moveDown();
    doc.text(
      `Periode: ${moment(start, "YYYY-MM-DD").format("DD-MM-YYYY")} sampai ${moment(
        end,
        "YYYY-MM-DD"
      ).format("DD-MM-YYYY")}`,
      { align: "center" }
    );

    doc.image(imageTable, 0, doc.y + 5, {
      fit: [pageWidth, boundingBox.height],
      align: "center",
    });

    // const imageHeight = boundingBox.height;
    // const imageWidth = boundingBox.width;
    // let availableHeightPage = pageHeight - doc.y;
    // let remainingHeightImage = imageHeight;
    // let currentY = doc.y + 5;

    // while (availableHeightPage > 0 && remainingHeightImage > 0) {
    //   console.log("============= Sisa Tinggi Kertas ================ " + availableHeightPage);
    //   console.log("============= Sisa Tinggi Gambar ================ " + remainingHeightImage);
    //   let cropHeightImage = remainingHeightImage - availableHeightPage; // Potong Gambar
    //   if (remainingHeightImage > 0 && remainingHeightImage < availableHeightPage) {
    //     cropHeightImage = availableHeightPage - remainingHeightImage;
    //   }
    //   console.log("============= Ukuran Tinggi Gambar ================ " + cropHeightImage);

    //   const buffer = await element.screenshot({
    //     clip: {
    //       x: 0,
    //       y: imageHeight - remainingHeightImage,
    //       width: imageWidth,
    //       height: cropHeightImage,
    //     },
    //   });

    //   doc.image(buffer, 0, currentY, {
    //     fit: [pageWidth, cropHeightImage],
    //     align: "center",
    //   });

    //   remainingHeightImage -= cropHeightImage; // Mencari berapa ukuran gambar tersisia

    //   if (remainingHeightImage > 0) {
    //     doc.addPage();
    //     availableHeightPage = doc.page.height;
    //     currentY = 0;
    //   }
    // }

    // while (remainingHeightImage > 0) {
    //   // const cropHeight = Math.max(availableHeight, remainingHeight);
    //   const cropHeight = remainingHeightImage - availableHeightPage;
    //   console.log(
    //     "=================== Available Height ====================== " + availableHeightPage
    //   );
    //   console.log(
    //     "=================== Remaining Height ====================== " + remainingHeightImage
    //   );
    //   const buffer = await element.screenshot({
    //     clip: {
    //       x: 0,
    //       y: imageHeight - remainingHeightImage,
    //       width: imageWidth,
    //       height: cropHeight,
    //     },
    //   });

    //   console.log(
    //     "=================== Remaining Height 1 ====================== " + remainingHeightImage
    //   );

    //   doc.image(buffer, 0, currentY, {
    //     fit: [pageWidth, cropHeight],
    //     align: "center",
    //   });

    //   remainingHeightImage -= cropHeight;
    //   console.log(
    //     "=================== Remaining Height 2 ====================== " + remainingHeightImage
    //   );
    //   // if (remainingHeightImage > 0) {
    //   //   doc.addPage();
    //   //   currentY = 0;
    //   // }
    // }

    // fs.unlinkSync("table.png", imageTable);

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    next(error);
  }
};
