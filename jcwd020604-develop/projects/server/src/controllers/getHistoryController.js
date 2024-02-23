const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

const getHistoryController = {
	getHistory: async (req, res) => {
		try {
			const { sort, search, warehouse_id, reference, time } = req.query;
			const limit = 12;

			const page = req?.query?.page || 1;
			let offset = (parseInt(page) - 1) * limit;

			const sortOptions = {
				productAsc: [
					[{ model: db.stocks }, { model: db.products }, "product_name", "ASC"],
				],
				productDesc: [
					[
						{ model: db.stocks },
						{ model: db.products },
						"product_name",
						"DESC",
					],
				],
				warehouseAsc: [
					[
						{ model: db.stocks },
						{ model: db.warehouses },
						"warehouse_name",
						"ASC",
					],
				],
				warehouseDesc: [
					[
						{ model: db.stocks },
						{ model: db.warehouses },
						"warehouse_name",
						"DESC",
					],
				],
				stockAfterAsc: [["stock_after", "ASC"]],
				stockAfterDesc: [["stock_after", "DESC"]],
				statusAsc: [["status", "ASC"]],
				statusDesc: [["status", "DESC"]],
				referenceAsc: [["reference", "ASC"]],
				referenceDesc: [["reference", "DESC"]],
				dateAsc: [["id", "ASC"]],
				dateDesc: [["id", "DESC"]],
			};
			const sortOrder = sortOptions[sort] || sortOptions.dateDesc;

			let whereClause = {
				"$stock.id$": {
					[Op.ne]: null,
				},
			};

			if (search) {
				whereClause["$stock.product.product_name$"] = {
					[Op.like]: `%${search || ""}%`,
				};
			}

			if (warehouse_id) {
				whereClause["$stock.warehouse_id$"] = {
					[Op.like]: `%${warehouse_id}%`,
				};
			}

			if (reference) {
				whereClause["$reference$"] = {
					[Op.like]: `%${reference}%`,
				};
			}

			if (time) {
				// Apply time filter if 'time' is selected
				whereClause[Op.and] = [
					{
						createdAt: { [Op.gte]: moment(time).format() },
					},
					{
						createdAt: {
							[Op.lte]: moment(time).endOf("month").format(),
						},
					},
				];
			}

			const history = await db.stock_histories.findAndCountAll({
				where: {
					...whereClause,
				},

				include: [
					{
						model: db.stocks,
						include: [
							{
								model: db.products,
								include: [{ model: db.product_images, limit: 1 }],
							},
							{ model: db.warehouses },
						],
					},
				],
				distinct: true,
				order: sortOrder,
			});

			res.status(200).send({
				count: history.count,
				rows: history.rows.slice(offset, limit * page),
			});
		} catch (err) {
			res.status(500).send({
				message: err.message,
			});
		}
	},
};

module.exports = getHistoryController;
