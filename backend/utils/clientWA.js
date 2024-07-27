const { Client, LocalAuth } = require("whatsapp-web.js");
// const { cleanDirectory } = require("./bugWhatsappWebJs");
const qrcode = require("qrcode-terminal");

let client;

module.exports = {
  init: (req, res, next) => {
    return new Promise((resolve, reject) => {
      client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
          headless: true, // Set to false if you want to see the browser
          args: [
            "--no-sandbox",
            "--no-experiments",
            "--hide-scrollbars",
            "--disable-plugins",
            "--disable-infobars",
            "--disable-translate",
            "--disable-pepper-3d",
            "--disable-extensions",
            "--disable-dev-shm-usage",
            "--disable-notifications",
            "--disable-setuid-sandbox",
            "--disable-crash-reporter",
            "--disable-smooth-scrolling",
            "--disable-login-animations",
            "--disable-dinosaur-easter-egg",
            "--disable-accelerated-2d-canvas",
            "--disable-rtc-smoothness-algorithm",
          ],
        },
      });

      client.on("qr", (qr) => {
        qrcode.generate(qr, { small: true });
        console.log("QR Received", qr);
      });

      client.on("ready", async () => {
        console.log("Client is ready!");
        resolve(client);
      });

      client.on("auth_failure", (msg) => {
        console.error("Authentication failure", msg);
        reject(new Error("Authentication failure"));
      });

      client.initialize();
    });
  },
  getClient: () => {
    if (!client) {
      throw new Error("Client not initialized");
    }
    return client;
  },
};
