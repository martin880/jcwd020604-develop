const { Op } = require("sequelize");
const db = require("../models");

const getProductController = {
	getAll: async (req, res) => {
		try {
			const { category_id, sort, search, page } = req.query;
			const where = {};
			const limit = 12;
			let offset = 0;

			if (category_id) {
				where.category_id = category_id;
			}

			if (page && parseInt(page) >= 1) {
				offset = (parseInt(page) - 1) * limit;
			}

			const sortOptions = {
				productAsc: [["product_name", "ASC"]],
				productDesc: [["product_name", "DESC"]],
				desctAsc: [["product_detail", "ASC"]],
				descDesc: [["product_detail", "DESC"]],
				categoryAsc: [["category_id", "ASC"]],
				categoryDesc: [["category_id", "DESC"]],
				priceAsc: [["price", "ASC"]],
				priceDesc: [["price", "DESC"]],
				weightAsc: [["weight", "ASC"]],
				weightDesc: [["weight", "DESC"]],
				newest: [["createdAt", "DESC"]],
			};
			const sortOrder = sortOptions[sort] || sortOptions.productAsc;

			const searchOptions = {
				product_name: {
					[Op.like]: `%${search}%`,
				},
			};

			const searchFilter = search ? searchOptions : null;

			const product = await db.products.findAndCountAll({
				where: {
					...where,
					...searchFilter,
				},
				include: [
					{ model: db.product_images, as: "product_images" },
					{ model: db.stocks, as: "stocks" },
					{ model: db.categories },
				],
				order: sortOrder,
				limit: limit,
				distinct: true,
				offset: offset,
			});
			res.status(200).send(product);
		} catch (err) {
			res.status(500).send({ message: err.message });
		}
	},
	getAllProduct: async (req, res) => {
		try {
			const product = await db.products.findAll({
				attributes: ["id", "product_name"],
				raw: true,
			});

			const sortedProduct = product.sort((a, b) => {
				return a.product_name.localeCompare(b.product_name);
			});

			res.status(200).send(sortedProduct);
		} catch (err) {
			res.status(500).send({
				message: err.message,
			});
		}
	},
	getProductByUuid: async (req, res) => {
		const { uuid } = req.params;
		try {
			const product = await db.products.findOne({
				where: { uuid },
				include: [
					{ model: db.product_images, as: "product_images" },
					{ model: db.stocks, as: "stocks" },
				],
			});
			if (!product) {
				return res.status(404).send({ message: "Product not found" });
			}
			return res.send(product);
		} catch (err) {
			res.status(500).send({ message: err.message });
		}
	},
};

module.exports = getProductController;
