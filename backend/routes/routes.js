const exprees = require("express");

const authRoutes = require("./auth");
const dashboardRoutes = require("./dashboard");
const spendingRoutes = require("./spending");
const inventoryRoutes = require("./inventory");
const customerRoutes = require("./customer");
const transactionRoutes = require("./transaction");
const recapRoutes = require("./recap");
const invoiceRoutes = require("./invoice");

const routes = exprees.Router();

routes.use(authRoutes);
routes.use(dashboardRoutes);
routes.use(customerRoutes);
routes.use(transactionRoutes);
routes.use(spendingRoutes);
routes.use(inventoryRoutes);
routes.use(recapRoutes);
routes.use(invoiceRoutes);

module.exports = routes;
