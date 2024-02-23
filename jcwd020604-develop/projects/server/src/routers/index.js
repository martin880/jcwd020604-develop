const productRouter = require("./productRouter");
const categoryRouter = require("./categoryRouter");
const stockRouter = require("./stockRouter");
const warehouseRouter = require("./warehouseRouter");
const userRouter = require("./UserRouter");
const addressRouter = require("./AddressRouter");
const cartRouter = require("./cartRouter");
const stockHistoryRouter = require("./stockHistoryRouter");
const stockMutationRouter = require("./stockMutationRouter");
const userOrderRouter = require("./UserOrderRouter");
const orderRouter = require("./OrderRouter");
const authRouter = require("./AuthRouter");
const insertAddressRouter = require("./InsertAddressRouter");
const passwordRouter = require("./PasswordRouter");
const paymentRouter = require("./PaymentRouter");
const handleActionOrderRouter = require("./HandleActionOrderRouter");
const salesReportRouter = require("./salesReportRouter");

module.exports = {
  authRouter,
  productRouter,
  categoryRouter,
  stockRouter,
  warehouseRouter,
  userRouter,
  addressRouter,
  insertAddressRouter,
  stockHistoryRouter,
  stockMutationRouter,
  cartRouter,
  orderRouter,
  passwordRouter,
  userOrderRouter,
  paymentRouter,
  handleActionOrderRouter,
  salesReportRouter,
};
