const { join } = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const router = require("./routers");
const db = require("./models");
// db.sequelize.sync({ alter: true });
// db.sequelize.sync({ force: true });

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
// app.use(
// 	cors({
// 		origin: [
// 			process.env.WHITELISTED_DOMAIN &&
// 				process.env.WHITELISTED_DOMAIN.split(","),
// 		],
// 	})
// );

app.use(express.json());

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

app.use("/api/product", router.productRouter);
app.use("/api/category", router.categoryRouter);
app.use("/api/cart", router.cartRouter);
app.use("/api/stock", router.stockRouter);
app.use("/api/stockhistory", router.stockHistoryRouter);
app.use("/api/stockmutation", router.stockMutationRouter);
app.use("/api/warehouse", router.warehouseRouter);
app.use("/api/productImg", express.static(`${__dirname}/public/productImg`));
app.use("/api/auth", router.userRouter);
app.use("/api/authentication", router.authRouter);
app.use("/api/address", router.addressRouter);
app.use("/api/insert-address", router.insertAddressRouter);
app.use("/api/password", router.passwordRouter);
app.use("/api/orders", router.orderRouter);
app.use("/api/action-order", router.handleActionOrderRouter);
app.use("/api/payment", router.paymentRouter);
app.use("/api/userOrders", router.userOrderRouter);
app.use("/api/report", router.salesReportRouter);

app.use("/api/userImg", express.static(`${__dirname}/public/userImg`));
app.use(
	"/api/paymentProof",
	express.static(`${__dirname}/public/paymentProof`)
);

app.get("/api", (req, res) => {
	res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
	res.status(200).json({
		message: "Hello, Student !",
	});
});

// ===========================

// not found
app.use((req, res, next) => {
	if (req.path.includes("/api/")) {
		res.status(404).send("Not found !");
	} else {
		next();
	}
});

// error
app.use((err, req, res, next) => {
	if (req.path.includes("/api/")) {
		console.error("Error : ", err.stack);
		res.status(500).send("Error !");
	} else {
		next();
	}
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
	res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
	if (err) {
		console.log(`ERROR: ${err}`);
	} else {
		console.log(`APP RUNNING at ${PORT} ✅`);
	}
});
