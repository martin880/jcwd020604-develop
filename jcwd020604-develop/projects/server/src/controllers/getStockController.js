const { Op } = require("sequelize");
const db = require("../models");

const getStockController = {
	getStock: async (req, res) => {
		try {
			const { sort, search } = req.query;
			const limit = 12;

			const page = req?.query?.page || 1;
			let offset = (parseInt(page) - 1) * limit;

			const sortOptions = {
				qtyAsc: [["qty", "ASC"]],
				qtyDesc: [["qty", "DESC"]],
				productAsc: [[{ model: db.products }, "product_name", "ASC"]],
				productDesc: [[{ model: db.products }, "product_name", "DESC"]],
				warehouseAsc: [[{ model: db.warehouses }, "warehouse_name", "ASC"]],
				warehouseDesc: [[{ model: db.warehouses }, "warehouse_name", "DESC"]],
				categoryAsc: [[{ model: db.products }, "category_id", "ASC"]],
				categoryDesc: [[{ model: db.products }, "category_id", "DESC"]],
			};
			const sortOrder = sortOptions[sort] || sortOptions.productAsc;

			const stock = await db.stocks.findAndCountAll({
				where: {
					[Op.and]: [
						{
							product_id: {
								[Op.like]: `${req.query.product_id}` || `%${""}%`,
							},
						},

						{
							warehouse_id: {
								[Op.like]: `%${req.query.warehouse_id || ""}%`,
							},
						},

						{
							"$product.product_name$": {
								[Op.like]: `%${search || ""}%`,
							},
						},
					],
				},
				include: [
					{
						model: db.products,
						include: [
							{ model: db.product_images, limit: 1 },
							{ model: db.categories },
						],
					},
					{ model: db.warehouses },
				],
				distinct: true,
				order: sortOrder,
			});

			res.status(200).send({
				count: stock.count,
				rows: stock.rows.slice(offset, limit * page),
			});
		} catch (err) {
			res.status(500).send({ message: err.message });
		}
	},
	getAllStock: async (req, res) => {
		try {
			const stocks = await db.stocks.findAll({
				where: {
					[Op.and]: [
						{
							warehouse_id: {
								[Op.like]: `%${req.query.warehouse_id || ""}%`,
							},
						},
					],
				},
				include: [
					{
						model: db.products,
						order: [["product_name", "ASC"]],
					},
					{ model: db.warehouses },
				],
			});

			res.status(200).send(stocks);
		} catch (err) {
			res.status(500).send({
				message: err.message,
			});
		}
	},
};

module.exports = getStockController;
