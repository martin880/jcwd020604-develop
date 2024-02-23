const db = require("../models");

const getCategoryController = {
	getCategory: async (req, res) => {
		try {
			const categories = await db.categories.findAll();

			const sortedCategories = categories.sort((a, b) => {
				return a.category_name.localeCompare(b.category_name);
			});

			res.status(200).send(sortedCategories);
		} catch (err) {
			res.status(500).send({
				message: err.message,
			});
		}
	},
	getCategoryById: async (req, res) => {
		const { id } = req.params;
		try {
			const category = await db.categories.findOne({ where: { id } });
			if (!category) {
				return res.status(404).send({ message: "Category not found" });
			}
			return res.status(200).send(category);
		} catch (err) {
			return res.status(500).send({ message: err.message });
		}
	},
};

module.exports = getCategoryController;
