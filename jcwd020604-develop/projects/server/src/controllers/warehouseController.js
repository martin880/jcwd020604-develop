const db = require("../models");
const axios = require("axios");
const Joi = require("joi");
const { Op } = require("sequelize");

const warehouseController = {
	insertWarehouse: async (req, res) => {
		const t = await db.sequelize.transaction();
		const warehouseSchema = Joi.object({
			warehouse_name: Joi.string().required(),
			address: Joi.string().required(),
			province: Joi.string().required(),
			city: Joi.string().required(),
			city_id: Joi.number().required(),
			district: Joi.string().required(),
			phone_number: Joi.string().required(),
		});
		const { error, value } = warehouseSchema.validate(req.body);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}

		try {
			const {
				warehouse_name,
				address,
				district,
				city,
				city_id,
				province,
				phone_number,
			} = value;

			const existingWarehouse = await db.warehouses.findOne({
				where: { warehouse_name },
			});

			if (existingWarehouse) {
				throw new Error("Warehouse with this name already exists.");
			}

			const response = await axios.get(
				"https://api.opencagedata.com/geocode/v1/json",
				{
					params: {
						q: `${address}, ${district}, ${province}, ${city}`,
						countrycode: "id",
						limit: 1,
						key: process.env.GEOCODE_API_KEY,
					},
				}
			);

			const { lat, lng } = response.data.results[0].geometry;

			const warehouse = await db.warehouses.create(
				{
					warehouse_name,
					address,
					province,
					city,
					city_id,
					district,
					phone_number,
					latitude: lat,
					longitude: lng,
				},
				{ transaction: t }
			);
			await t.commit();
			res.send(warehouse);
		} catch (err) {
			await t.rollback();
			return res.status(500).send({ message: err.message });
		}
	},
	editWarehouse: async (req, res) => {
		const {
			warehouse_name,
			address,
			province,
			city,
			city_id,
			district,
			phone_number,
		} = req.body;
		const { id } = req.params;
		const t = await db.sequelize.transaction();
		const schema = Joi.object({
			warehouse_name: Joi.string().required(),
			address: Joi.string().required(),
			province: Joi.string().required(),
			city: Joi.string().required(),
			city_id: Joi.number().required(),
			district: Joi.string().required(),
			phone_number: Joi.string().required(),
		});
		const validation = schema.validate({
			warehouse_name,
			address,
			province,
			city,
			city_id,
			district,
			phone_number,
		});
		if (validation.error) {
			return res
				.status(400)
				.send({ message: validation.error.details[0].message });
		}
		try {
			const existingWarehouse = await db.warehouses.findOne({
				where: {
					warehouse_name,
					id: { [Op.not]: id },
				},
			});
			if (existingWarehouse) {
				return res
					.status(400)
					.send({ message: "Warehouse name already exists." });
			}
			const response = await axios.get(
				"https://api.opencagedata.com/geocode/v1/json",
				{
					params: {
						q: `${address}, ${district}, ${province}, ${city}`,
						countrycode: "id",
						limit: 1,
						key: process.env.GEOCODE_API_KEY,
					},
				}
			);
			const { lat, lng } = response.data.results[0].geometry;
			await db.warehouses.update(
				{
					warehouse_name,
					address,
					province,
					city,
					city_id,
					district,
					phone_number,
					latitude: lat,
					longitude: lng,
				},
				{ where: { id }, returning: true, transaction: t }
			);
			await t.commit();
			res.status(200).send({ message: "Warehouse updated successfully." });
		} catch (err) {
			await t.rollback();
			return res.status(500).send({ message: err.message });
		}
	},
	deleteWarehouse: async (req, res) => {
		const { id } = req.params;
		const t = await db.sequelize.transaction();
		try {
			const warehouse = await db.warehouses.findOne({ where: { id } });
			if (!warehouse) {
				return res.status(404).send({ message: "Warehouse not found." });
			}
			await db.warehouses.destroy({
				where: { id: id },
				transaction: t,
			});
			await t.commit();
			res.send({ message: "Warehouse deleted successfully." });
		} catch (err) {
			await t.rollback();
			return res.status(500).send({ message: err.message });
		}
	},
	assignAdminUserToWarehouse: async (req, res) => {
		const t = await db.sequelize.transaction();
		try {
			const { warehouse_id, uuid } = req.body;

			const warehouse = await db.warehouses.findByPk(warehouse_id);
			if (!warehouse) {
				return res.status(404).json({ error: "Warehouse not found." });
			}
			const existingUser = await db.users.findOne({
				where: { uuid },
			});
			if (!existingUser) {
				return res.status(404).json({ error: "User not found." });
			}
			if (!existingUser.verified) {
				return res.status(403).json({ error: "The user is not an admin." });
			}
			if (
				existingUser.warehouse_id &&
				existingUser.warehouse_id !== warehouse_id
			) {
				return res
					.status(400)
					.json({ error: "User is already assigned to another warehouse." });
			}

			await db.users.update(
				{ warehouse_id },
				{ where: { uuid }, transaction: t }
			);
			await t.commit();
			res.send({ message: "Warehouse assignment successful." });
		} catch (err) {
			await t.rollback();
			return res.status(500).send({ message: err.message });
		}
	},
};
module.exports = warehouseController;
