const db = require("../models");
const Joi = require("joi");
const { Op, or } = require("sequelize");
const autoMutation = require("../service/autoMutationService");
const warehouse = require("../models/warehouse");
const haversine = require("haversine");
const orderDetail = require("../models/orderDetail");

const ordersController = {

	getAllOrder: async (req, res) => {
		try {
			const { status, warehouse_id } = req.query;
			const limit = 3;

			const page = req?.query?.page || 1;
			let offset = (parseInt(page) - 1) * limit;

			let whereClause = {};

			if (status) {
				whereClause["$status$"] = {
					[Op.like]: `${status}`,
				};
			}

			if (warehouse_id) {
				whereClause["$orders.warehouse_id$"] = {
					[Op.like]: `${warehouse_id}`,
				};
			}

			const orders = await db.orders.findAndCountAll({
				where: {
					...whereClause,
				},
				include: [
					{
						model: db.order_details,
						include: [
							{
								model: db.stocks,
								include: [
									{
										model: db.products,
										include: [{ model: db.product_images }],
									},
									{ model: db.warehouses },
								],
							},
						],
					},
					{ model: db.users, include: [{ model: db.addresses }] },
				],
				distinct: true,
			});
			res.status(200).json({
				count: orders.count,
				rows: orders.rows.slice(offset, limit * page),
			});
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error retrieving order", error: error.message });
		}
	},

	getOrderById: async (req, res) => {
		try {
			const { id } = req.params;
			const order = await db.orders.findOne({
				where: { id },
				include: [
					{
						model: db.order_details,
						include: [
							{
								model: db.stocks,
								include: [
									{
										model: db.products,
										include: [{ model: db.product_images }],
									},
									{ model: db.warehouses },
								],
							},
						],
					},
					{ model: db.users, include: [{ model: db.addresses }] },
				],
			});
			if (order) {
				res.status(200).json(order);
			} else {
				res.status(404).json({ message: "Order not found" });
			}
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error retrieving order", error: error.message });
		}
	},

	getOrderDetailById: async (req, res) => {
		try {
			const { id } = req.params;
			const order_detail = await db.order_details.findOne({
				where: { id },
				include: [{ model: db.stocks }],
			});
			if (order_detail) {
				res.status(200).json(order_detail);
			} else {
				res.status(404).json({ message: "Order not found" });
			}
		} catch (error) {
			res
				.status(500)
				.json({ message: "Error retrieving order", error: error.message });
		}
	},

	updateOrder: async (req, res) => {
		const { id } = req.params;
		const {
			payment_detail,
			payment_proof,
			invoice,
			shipping_cost,
			total_price,
			courier,
			status,
			user_id,
			address_id,
		} = req.body;

		const t = await db.sequelize.transaction();

		try {
			const [updatedRows] = await db.orders.update(req.body, {
				where: { id: id },
				transaction: t,
			});

			if (updatedRows > 0) {
				await t.commit();
				res.status(200).json({ message: "Order updated successfully" });
			} else {
				await t.rollback();
				res.status(404).json({ message: "Order not found" });
			}
		} catch (error) {
			await t.rollback();
			res
				.status(500)
				.json({ message: "Error updating order", error: error.message });
		}
	},

	deleteOrder: async (req, res) => {
		const { id } = req.params;
		const t = await db.sequelize.transaction();

		try {
			const order = await db.orders.findOne({ where: { id } });
			if (!order) {
				return res.status(404).send({ message: "Orders not found." });
			}

			await db.orders.destroy({
				where: { id: id },
				transaction: t,
			});

			await t.commit();
			res.send({ message: "Orders deleted successfully." });
		} catch (err) {
			await t.rollback();
			return res.status(500).send({ message: err.message });
		}
	},
};
module.exports = ordersController;
