const { Client, LocalAuth } = require("whatsapp-web.js");
// const { cleanDirectory } = require("./bugWhatsappWebJs");
const qrcode = require("qrcode-terminal");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
  },
  // webVersion: "2.2409.2",
  // webVersionCache: { type: "local" },
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Client is ready!");
});

// When the client received QR-Code
app.get("/qr", (req, res) => {
  // When the client received QR-Code
  client.on("qr", (qr) => {
    // Generate the QR code as a data URI
    qrcode.toDataURL(qr, { small: true }, (err, url) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error generating QR code");
        return;
      }
      // Send the QR code data URI as a response to the client
      res.send(`<img src="${url}">`);
    });
  });
});
