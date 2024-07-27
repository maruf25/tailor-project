const path = require("path");
const express = require("express");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const bodyParser = require("body-parser");
const multer = require("multer");
const { v1: uuidv4 } = require("uuid");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const db = require("./utils/db");
const { init } = require("./utils/clientWA");
const moment = require("moment");

require("moment/locale/id");

moment.locale("id");

// Model
const User = require("./models/UserModels");
const Spending = require("./models/SpendingModels");
const Inventory = require("./models/InventoryModels");
const Transaction = require("./models/TransactionModels");
// const Customer = require("./models/CustomerModel");

// Routes
const routes = require("./routes/routes");

const app = express();

// Realitionship
User.hasMany(Transaction, { onDelete: "RESTRICT" });
Transaction.belongsTo(User);
User.hasMany(Spending);
Spending.belongsTo(User);
Inventory.hasMany(Spending, { onDelete: "RESTRICT" });
Spending.belongsTo(Inventory);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    preflightContinue: true,
    credentials: true,
  })
);

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
app.use("/api/images", express.static(path.join(__dirname, "images")));

app.get("/invoiceHtml", function (req, res) {
  res.sendFile(path.join(__dirname, "utils/", "temp.html"));
});

app.use("/api", routes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.get("/", (req, res, send) => {
  res.send("api ready!!!");
});

db.sync()
  .then(async () => {
    const existingUser = await User.findOne({ where: { username: "admin" } });
    if (!existingUser) {
      const passwordHash = await bcrypt.hash("password", 12);
      await User.create({
        name: "Admin",
        no_whatsapp: "1111111111111",
        username: "admin",
        password: passwordHash,
        role: "admin",
      });
    }
    await init();

    console.log("connect database");
    app.listen(process.env.PORT, () => console.log("Server Running...."));
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    process.exit(1);
  });
