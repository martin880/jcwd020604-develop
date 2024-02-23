const db = require("../models");
const Joi = require("joi");

const stockMutation = {
	requestMutation: async (req, res) => {
		const { qty, stock_id, from_warehouse_id, to_warehouse_id } = req.body;
		const t = await db.sequelize.transaction();

		const schema = Joi.object({
			qty: Joi.number().min(0).required(),
			stock_id: Joi.number().required(),
			from_warehouse_id: Joi.number().required(),
			to_warehouse_id: Joi.number().required(),
		});

		const validation = schema.validate({
			qty,
			stock_id,
			from_warehouse_id,
			to_warehouse_id,
		});

		if (validation.error) {
			return res
				.status(400)
				.send({ message: validation.error.details[0].message });
		}

		// Check if 'from_warehouse_id' is equal to 'to_warehouse_id'
		if (from_warehouse_id === to_warehouse_id) {
			return res.status(400).send({
				message: "Source and destination warehouses cannot be the same.",
			});
		}

		try {
			// Check if there is enough stock from selected warehouse
			const existingStock = await db.stocks.findOne({
				where: {
					id: stock_id,
					warehouse_id: from_warehouse_id,
				},
			});

			if (!existingStock || existingStock.qty < qty) {
				return res
					.status(404)
					.send({ message: "Insufficient stock from selected warehouse." });
			}

			// Check if stock mutation is pending
			const pendingMutation = await db.stock_mutations.findOne({
				where: {
					stock_id,
					from_warehouse_id,
					to_warehouse_id,
					status: "PENDING",
				},
			});

			if (pendingMutation) {
				return res
					.status(409)
					.send({ message: "Stock mutation has pending confirmation" });
			}

			await db.stock_mutations.create(
				{
					qty,
					stock_id,
					to_warehouse_id,
					from_warehouse_id,
					status: "PENDING",
				},
				{ transaction: t }
			);
			await t.commit();
			res.status(200).send({
				message: "Stock mutation request submitted for confirmation.",
			});
		} catch (err) {
			await t.rollback();
			res.status(500).send({ message: err.message });
		}
	},
	editMutation: async (req, res) => {
		const { qty } = req.body;
		const { id } = req.params;
		const t = await db.sequelize.transaction();

		const schema = Joi.object({
			qty: Joi.number().min(0).required(),
		});

		const validation = schema.validate({
			qty,
		});

		if (validation.error) {
			return res
				.status(400)
				.send({ message: validation.error.details[0].message });
		}
		try {
			const existingMutation = await db.stock_mutations.findOne({
				where: { id },
			});
			if (!existingMutation) {
				return res.status(404).send({ message: "Stock mutation not found." });
			}
			const existingStock = await db.stocks.findOne({
				where: {
					id: existingMutation.stock_id,
					warehouse_id: existingMutation.from_warehouse_id,
				},
			});
			if (!existingStock || existingStock.qty < qty) {
				return res
					.status(404)
					.send({ message: "Insufficient stock from selected warehouse." });
			}
			await db.stock_mutations.update(
				{
					qty,
				},
				{
					where: { id: id },
					transaction: t,
				}
			);
			await t.commit();
			res.status(200).send({ message: "Mutation updated successfully." });
		} catch (err) {
			await t.rollback();
			res.status(500).send({ message: err.message });
		}
	},
	cancelMutation: async (req, res) => {
		const { id } = req.params;
		const t = await db.sequelize.transaction();

		try {
			const existingMutation = await db.stock_mutations.findOne({
				where: { id, status: "PENDING" },
			});

			if (!existingMutation) {
				return res.status(404).send({ message: "Stock mutation not found." });
			}

			await db.stock_mutations.destroy({
				where: { id: id },
				transaction: t,
			});
			await t.commit();
			res.status(200).send({ message: "Stock mutation canceled" });
		} catch (err) {
			await t.rollback();
			return res.status(500).send({ message: err.message });
		}
	},
};

module.exports = stockMutation;
