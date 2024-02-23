const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

const getStockMutation = {
	getMutation: async (req, res) => {
		try {
			const { sort, search, time, status, from_warehouse_id, to_warehouse_id } =
				req.query;
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
				from_WarehouseAsc: [["from_Warehouse_id", "ASC"]],
				from_WarehouseDesc: [["from_Warehouse_id", "DESC"]],
				mutation_codeAsc: [["mutation_code", "ASC"]],
				mutation_codeDesc: [["mutation_code", "DESC"]],
				qtyAsc: [["qty", "ASC"]],
				qtyDesc: [["qty", "DESC"]],
				statusAsc: [["status", "ASC"]],
				statusDesc: [["status", "DESC"]],
				dateAsc: [["createdAt", "ASC"]],
				dateDesc: [["createdAt", "DESC"]],
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

			if (status) {
				whereClause["$status$"] = {
					[Op.like]: `%${status}%`,
				};
			}

			if (time) {
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

			if (from_warehouse_id) {
				whereClause["$from_warehouse_id$"] = {
					[Op.like]: `%${from_warehouse_id}%`,
				};
			}

			if (to_warehouse_id) {
				whereClause["$to_warehouse_id$"] = {
					[Op.like]: `%${to_warehouse_id}%`,
				};
			}

			const mutation = await db.stock_mutations.findAndCountAll({
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
						],
					},
					{
						model: db.warehouses,
						as: "from_warehouse",
					},
					{
						model: db.warehouses,
						as: "to_warehouse",
					},
				],
				distinct: true,
				order: sortOrder,
			});

			return res.status(200).send({
				count: mutation.count,
				rows: mutation.rows.slice(offset, limit * page),
			});
		} catch (err) {
			res.status(500).send({ message: err.message });
		}
	},
	getMutationRequest: async (req, res) => {
		try {
			const { from_warehouse_id } = req.query;

			let whereClause = {
				"$stock.id$": {
					[Op.ne]: null,
				},
			};

			if (from_warehouse_id) {
				whereClause["$from_warehouse_id$"] = {
					[Op.like]: `%${from_warehouse_id}%`,
				};
			}

			const request = await db.stock_mutations.findAll({
				where: { status: "PENDING", ...whereClause },
				include: [
					{
						model: db.stocks,
						include: [
							{ model: db.products, include: [{ model: db.product_images }] },
						],
					},
					{
						model: db.warehouses,
						as: "from_warehouse",
					},
					{
						model: db.warehouses,
						as: "to_warehouse",
					},
				],
			});
			res.status(200).send(request);
		} catch (err) {
			res.status(500).send({ message: err.message });
		}
	},
};

module.exports = getStockMutation;
