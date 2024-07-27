const path = require("path");
const fs = require("fs");
const { MessageMedia } = require("whatsapp-web.js");
const puppeteer = require("puppeteer");
const { getClient, init } = require("../utils/clientWA");
const { deleteFile } = require("../utils/deleteFile");
const moment = require("moment");

const formatRupiah = (angka) => {
  var number_string = angka.replace(/[^,\d]/g, "").toString(),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    var separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;

  return "Rp. " + rupiah;
};

exports.sendingInvoice = (data) => {
  return new Promise(async (resolve, reject) => {
    const invoiceId = data.invoiceId;
    // const token = data.token;

    const name = data.name;
    const number = data.no_whatsapp + "@c.us";
    const status = data.status?.toUpperCase();

    const message = `Halo *${name}*,

Kami ingin menginformasikan bahwa invoice untuk pesanan Anda telah tersedia.
  
Untuk detail lebih lanjut, silakan lihat file invoice yang kami lampirkan. Berikut adalah ringkasan pesanan Anda:
- Status: *${status}*
  
Jika Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, jangan ragu untuk menghubungi tim dukungan kami.
  
Terima kasih atas kepercayaan Anda kepada kami.
  
Salam hangat,
Tim Emi Tailor 🙏`;

    const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="invoicePage" class="max-w-[750px] min-h-[700px] text-black">
          <img  class="absolute min-h-[700px]" src="../watermarkInvoice.png" alt="" />
          <div class="max-w-[750px] min-h-[700px] relative z-10">
            
            <div class="h-[150px] bg-[#F4F5F7] flex justify-between items-center p-6">
              <img src="../Logo.png" class="w-[150px]" alt="" />
              <p class="text-xl font-bold">#${data.order.name}</p>
            </div>
            
            <div class="flex flex-col items-center justify-center gap-3 p-6 text-3xl font-bold">
              <p>Pesanan ${status}</p>
              <p class="text-base font-normal text-[#7C7C7C]">
                ${moment(data.order?.updatedAt).format("DD MMMM YYYY HH:mm:ss")} WIB
              </p>
              <p>${formatRupiah(data.order.price)}</p>
            </div>
           
            <div class="min-h-[300px] font-semibold border border-y-4 border-x-0 border-dotted border-black text-2xl flex flex-col justify-center">
              <div class="flex justify-between p-6">
                <p>Customer</p>
                <p>${name}</p>
              </div>
              <div class="flex justify-between p-6">
                <p>No Whatsapp</p>
                <p>${data.no_whatsapp}</p>
              </div>
            </div>
            
            <div class="h-[82px] justify-center text-center inline-flex w-full items-center font-bold text-2xl">
              <p>Terimakasih Atas kepercayaanya 🙏</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

    const pathFile = path.join(__dirname, "../", "invoice/", "Invoice " + invoiceId + ".pdf");
    const tempHtmlPath = path.join(__dirname, "temp.html");
    fs.writeFileSync(tempHtmlPath, htmlContent);

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setViewport({
        width: 750,
        height: 700,
      });

      // await page.setCookie({
      //   name: "token",
      //   value: token,
      //   domain: "localhost",
      // });

      // await page.goto("http://localhost:3000/dashboard/invoice/" + invoiceId, {
      //   waitUntil: "networkidle0",
      // });

      await page.goto(`file://${tempHtmlPath}`, { waitUntil: "networkidle0" });

      const element = await page.$("#invoicePage");
      const boundingBox = await element.boundingBox();

      const pdfOptions = {
        path: pathFile,
        width: `${boundingBox.width}px`,
        height: `${boundingBox.height}px`,
        printBackground: true,
      };

      await page.pdf(pdfOptions);

      await browser.close();

      const media = MessageMedia.fromFilePath(pathFile);
      await getClient().sendMessage(number, media, { caption: message });

      deleteFile(pathFile);
      resolve("success create and send invoice");
    } catch (err) {
      console.log(err);

      if (
        err.message.includes(
          "Protocol error (Runtime.callFunctionOn): Session closed. Most likely the page has been closed"
        )
      ) {
        console.log("Session closed error detected. Reinitializing client...");
        deleteFile(pathFile);
        // Inisialisasi ulang klien
        await init();
      }
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      reject(err);
    }
  });
};
