const db = require("../models");
const axios = require("axios");

const getWarehouseController = {
	getWarehouse: async (req, res) => {
		try {
			const warehouses = await db.warehouses.findAll();

			const sortedWarehouses = warehouses.sort((a, b) => {
				return a.warehouse_name.localeCompare(b.warehouse_name);
			});

			res.status(200).send(sortedWarehouses);
		} catch (err) {
			res.status(500).send({
				message: err.message,
			});
		}
	},
	getWarehouseById: async (req, res) => {
		const { id } = req.params;
		try {
			const warehouse = await db.warehouses.findOne({ where: { id } });
			if (!warehouse) {
				return res.status(404).send({ message: "Warehouse not found" });
			}
			return res.send(warehouse);
		} catch (err) {
			return res.status(500).send({ message: err.message });
		}
	},
	getAllProvince: async (req, res) => {
		try {
			const result = await axios.get(
				"https://api.rajaongkir.com/starter/province",
				{
					headers: {
						key: process.env.RAJA_ONGKIR_API,
					},
				}
			);
			res.send(result.data.rajaongkir.results);
		} catch (err) {
			res.status(500).send({
				message: err.message,
			});
		}
	},
	getAllCity: async (req, res) => {
		try {
			const result = await axios.get(
				"https://api.rajaongkir.com/starter/city",
				{
					headers: {
						key: process.env.RAJA_ONGKIR_API,
					},
				}
			);
			res.send(result.data.rajaongkir.results);
		} catch (err) {
			res.status(500).send({
				message: err.message,
			});
		}
	},
};

module.exports = getWarehouseController;
