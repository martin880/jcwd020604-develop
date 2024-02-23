const productController = require("./productController");
const getProductController = require("./getProductController");
const categoryController = require("./categoryController");
const stockController = require("./stockControllers");
const getStockController = require("./getStockController");
const warehouseController = require("./warehouseController");
const getWarehouseController = require("./getWarehouseController");
const userController = require("./UserController");
const addressController = require("./AddressController");
const stockMutationController = require("./stockMutationController");
const handleStockMutationController = require("./handleStockMutationController");
const getStockMutationController = require("./getStockMutationController");
const cartControllers = require("./cartController");
const ordersController = require("./OrderController");
const getCategoryController = require("./getCategoryController");
const getHistoryController = require("./getHistoryController");
const userOrdersController = require("./UserOrderController");
const authController = require("./AuthController");
const insertAddressController = require("./InsertAddressController");
const passwordController = require("./PasswordController");
const handlePaymentController = require("./HandlePaymentController");
const handleActionOrderController = require("./HandleActionOrderController");
const salesReportController = require("./salesReportController");

module.exports = {
  authController,
  productController,
  getProductController,
  categoryController,
  stockController,
  getStockController,
  warehouseController,
  getWarehouseController,
  userController,
  addressController,
  stockMutationController,
  handleStockMutationController,
  getStockMutationController,
  cartControllers,
  ordersController,
  getCategoryController,
  getHistoryController,
  insertAddressController,
  passwordController,
  userOrdersController,
  handlePaymentController,
  handleActionOrderController,
  salesReportController,
};
